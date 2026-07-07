---
date: 2026-07-07
slug: 2026-07-07-streaming-real-time-ai-telemetry-with-firebase-genkit-and-angular-signals
title: 'Streaming Real-Time AI Telemetry with Firebase Genkit and Angular Signals'
image: streaming-ai-telemetry.png
avatar: angular-logo.png
categories: angular,firebase
tags: angular,signals,firebase,ai
---

We’ve all been there. You click a button in a modern web app, and you’re immediately greeted by a generic 
loading spinner. You sit there, staring at it for 10 or 15 seconds while some heavy LLM pipeline runs in the 
background. It’s a frustrating user experience, and honestly, it’s usually the result of a lazy architectural pattern.

When you're building complex, multi-step AI features (like a resume optimization engine that needs to parse text, 
check formatting, evaluate metrics, and then generate tips), waiting for the entire chain to finish before returning 
data feels painfully slow.

Instead of forcing your users to stare blindly at a loading screen, you can build a live, interactive 
pipeline experience. Let's look at how to orchestrate a serverless AI pipeline using Firebase Genkit 
and Gemini 3.5 Flash, streaming real-time progress telemetry milestones directly down to a reactive Angular Signals 
architecture in the browser.

## The Telemetry Architecture
The core goal here is straightforward: we want to avoid the overhead of writing intermediate processing states to a 
database collection just to update the client. Instead, we want direct, memory-to-client streaming.

As our serverless backend hits specific checkpoints in the execution loop, it pushes small status keys down an open 
HTTP connection. The Angular application catches these chunks on the fly and updates local Signals, driving our 
UI completely declaratively.

### 1. Setting Up the Backend Genkit Flow
First, let’s look at the backend. We'll leverage Firebase Genkit’s `onCallGenkit` wrapper, which exposes our pipeline 
as a secure, type-safe Callable Cloud Function out of the box.

Instead of passing everything into a single prompt, we are going to chain multiple model calls sequentially. This 
allows us to trigger unique telemetry steps for the user while increasing overall accuracy. We will also define a 
strict structure using Zod to force the final Gemini model call to return precisely the data contract our frontend 
expects.

```typescript
// functions/src/index.ts
import { ai } from '@genkit-ai/firebase';
import { onCallGenkit } from '@genkit-ai/firebase/functions';
import { z } from 'zod';

const ResumeAnalysisSchema = z.object({
    atsScore: z.number().min(0).max(100),
    formattingReview: z.string(),
    actionableTips: z.array(z.string()),
});

export const analyzeResumeFlow = onCallGenkit(
    {
        authPolicy: (auth) => auth?.token.email_verified === true,
    },
    async (input, streamingCallback) => {
        const { resumeText } = input;
        
        // Milestone 1: Structural Scan
        if (streamingCallback) {
          streamingCallback({ status: 'parsing_structure' });
        }
        const structureResponse = await ai.models.generate({
          model: 'gemini-3.5-flash',
          prompt: `Analyze the layout and structural elements of this resume for ATS friendliness: ${resumeText}`,
        });
        const structuralNotes = structureResponse.text;
    
        // Milestone 2: Content Impact Analysis
        if (streamingCallback) {
          streamingCallback({ status: 'analyzing_impact' });
        }
        const impactResponse = await ai.models.generate({
          model: 'gemini-3.5-flash',
          prompt: `Review the bullet points in this resume. Focus heavily on strong action verbs and quantifiable metrics: ${resumeText}`,
        });
        const impactNotes = impactResponse.text;
    
        // Milestone 3: Compile Tips & Enforce Final Schema
        if (streamingCallback) {
          streamingCallback({ status: 'generating_tips' });
        }
        const finalResponse = await ai.models.generate({
          model: 'gemini-3.5-flash',
          prompt: `
            You are a resume optimization engine. Review the structural analysis and impact notes provided below.
            Compile them into the requested JSON schema.
            
            Structural Analysis: ${structuralNotes}
            Impact Analysis: ${impactNotes}
          `,
          config: {
            responseMimeType: 'application/json',
            responseSchema: ResumeAnalysisSchema,
          }
        });
    
        // Returning this fully resolves the function call and closes the stream
        return JSON.parse(finalResponse.text);
    }
);
```
### 2. Consuming Asynchronous Streams in Angular
On the Angular side, we need to handle this live chunked response protocol. Firebase’s standard `httpsCallable` handler 
actually returns a stream reference that contains an asynchronous iterable (stream).

We can write a clean, injectable service that handles the plumbing and updates read-only Signals for our UI components 
to consume safely.

```typescript
// src/app/services/resume-analyzer.service.ts
import { Injectable, signal } from '@angular/core';
import { getFunctions, httpsCallable } from 'firebase/functions';

export type ResumeStep = 'idle' | 'parsing_structure' | 'analyzing_impact' | 'generating_tips' | 'complete' | 'error';

@Injectable({
    providedIn: 'root'
})
export class ResumeAnalyzerService {
    private functions = getFunctions();

    // 1. Keep the writable signals private so components can't touch them
    private readonly _currentStep = signal<ResumeStep>('idle');
    private readonly _analysisResult = signal<any | null>(null);

    // 2. Expose read-only Signals to the consuming component(s)
    readonly currentStep = this._currentStep.asReadonly();
    readonly analysisResult = this._analysisResult.asReadonly();
    
    async runAnalysis(rawText: string) {
        this._currentStep.set('parsing_structure');
        this._analysisResult.set(null);
    
        const runFlow = httpsCallable<{ resumeText: string }, any>(this.functions, 'analyzeResumeFlow');
    
        try {
          // 1. Invoke the callable function to initiate the connection
          const streamResult = await runFlow({ resumeText: rawText });
          
          // 2. Loop through stream chunks in true real-time using for await...of
          for await (const chunk of streamResult.stream) {
            if (chunk.status) {
              this._currentStep.set(chunk.status as ResumeStep);
            }
          }
    
          // 3. Capture the final completely-resolved JSON structure
          const finalResult = await streamResult.data;
          this._analysisResult.set(finalResult);
          this._currentStep.set('complete');
    
        } catch (error) {
          console.error('Real-time telemetry stream failed:', error);
          this._currentStep.set('error');
        }
    }
}
```
### 3. Building the Declarative UI Template
Because our service exposes standard Signals, our template code becomes incredibly clean. We can skip complex RxJS 
mapping pipelines and heavy async pipes entirely, opting instead for modern Angular template control flow blocks 
(`@switch` and `@for`).

```html
<div class="analyzer-card">
  <h2>AI Resume Optimization Engine</h2>

  <textarea #resumeInput placeholder="Paste your resume markdown or text here..."></textarea>
  <button (click)="service.runAnalysis(resumeInput.value)">Scan My Resume</button>

  <div class="telemetry-pipeline">
    @switch (service.currentStep()) {
      @case ('parsing_structure') {
        <div class="status scanning">🔎 Step 1/3: Checking ATS parsing tags...</div>
      }
      @case ('analyzing_impact') {
        <div class="status scanning">⚡ Step 2/3: Measuring action verb impact...</div>
      }
      @case ('generating_tips') {
        <div class="status scanning">🤖 Step 3/3: Assembling tailored recommendations...</div>
      }
      @case ('complete') {
        <div class="status success">✓ Optimization Review Complete!</div>

        <div class="score">ATS Score: {{ service.analysisResult()?.atsScore }}/100</div>
        
        <h3>Actionable Improvement Tips</h3>
        <ul class="tips-list">
          @for (tip of service.analysisResult()?.actionableTips; track tip) {
            <li>{{ tip }}</li>
          }
        </ul>
      }
      @case ('error') {
        <div class="status error">Pipeline failed. Check console trace logs.</div>
      }
    }
  </div>
</div>
```

## Real-World Production Takeaways
When moving this architectural pattern into production apps, here are a few things to keep in mind:

* Handling Cold Starts: Serverless execution blocks can experience latency spikes during environment scale-up. Set 
your initial state to a variation like "Warming up AI engine..." so users understand the system is 
initializing rather than hanging.

* Local Debugging & Tracing: Avoid running up cloud token expenses during development. Run the Firebase Emulator 
Suite alongside the native Genkit Developer UI (`npx genkit start`) to review execution traces, token inputs, and 
processing timing data entirely offline.

* Drastic Cost Optimization: Building a pipeline telemetry system this way completely avoids updating state strings 
inside database rows. Passing these states natively in-memory via HTTP chunks cuts down on heavy Firestore read/write 
storage overheads entirely.

## Summary
By connecting Genkit's server-side telemetry capabilities with Angular's blazing-fast Signal system, you transform 
an inherently sluggish AI workflow into a highly interactive, responsive application experience.

How are you managing multi-step AI prompts in your application pipelines? Let's discuss your preferred state 
patterns in the comments!