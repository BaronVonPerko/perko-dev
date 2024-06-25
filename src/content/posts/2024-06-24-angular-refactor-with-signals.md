---
date: 2024-06-24
title: Angular Code Refactor with Signals
image: drupal.jpg
categories: angular
tags: angular,refactor
---

> [The code used in this tutorial can be found here.](https://stackblitz.com/edit/nnvvmu-bg53ey?file=src%2Fexample-signals%2Fexample-signals.ts)

I've recently been perusing through the [Angular Community Discord](https://discord.gg/9TttDCgm) 
server, trying to help out those in need. I came across an issue by a user by the name of 
Tsuki who asked [this question](https://discord.com/channels/748677963142135818/1245683547960770601).

Their code was _mostly_ working, but could use a refactor. In the original thread, I did not
introduce signals, but I think we can take what we have and take it one step further and use
signals.

## Initial Code

This is a small sample app that has a couple of things going on. First, the component
calls an API endpoint to get some user information. This is used for options in a 
select box. The app will automatically select the first user in the select dropdown,
and then use that to trigger the loading of a table, which shows data about the
selected user. Each time the user changes the selected user, the table will be
updated with the user information.

Each time this changes, the table gets its data from the API. Both the select
box and the table have a loading spinner which should show while its respective
component is loading. The `test()` function is called any time the select box
is changed, updating the table.

```ts
@Component({
  selector: 'snack-bar-overview-example',
  templateUrl: 'snack-bar-overview-example.html',
  styleUrl: 'snack-bar-overview-example.css',
  standalone: true,
  imports: [DropdownModule, FormsModule, ProgressSpinnerModule, TableModule],
})
export class SnackBarOverviewExample {
  public data: any;
  public isLoading: boolean = false;
  public selectedItem: any;
  public tableData: any;
  public isTableLoading: boolean = false;
  public isFirstComponentLoaded: boolean = false;

  constructor(private http: HttpClient) {}
  
  ngOnInit() {
    this.isLoading = true;
    this.http
      .get('https://reqres.in/api/users?page=1')
      .pipe(delay(2000))
      .subscribe({
        next: (response: any) => {
          this.data = response.data;
          this.selectedItem = this.data[0].id; //default item
          this.isLoading = false;
          this.isFirstComponentLoaded = true;
        },
      });
  }

  test() {
    this.isTableLoading = true;
    this.http
      .get('https://reqres.in/api/users?page=1')
      .pipe(delay(2000))
      .subscribe({
        next: (response: any) => {
          this.data = response.data;
          this.tableData = this.data.filter(
            (item: any) => item.id == this.selectedItem
          );
          this.isTableLoading = false;
        },
      });
  }
}
```

And the HTML:

```html
@if (isLoading) {
<p-progressSpinner ariaLabel="loading" />
} @else {
<p-dropdown
  [options]="data"
  optionLabel="first_name"
  optionValue="id"
  [(ngModel)]="selectedItem"
  (ngModelChange)="test()"
/>
} 

@if (isTableLoading) {
<p-progressSpinner ariaLabel="loading" />
} @else {
<p-table [value]="tableData">
  <ng-template pTemplate="header">
    <tr>
      <th>ID</th>
      <th>Email</th>
    </tr>
  </ng-template>
  <ng-template pTemplate="body" let-data>
    <tr>
      <td>{{data.id}}</td>
      <td>{{data.email}}</td>
    </tr>
  </ng-template>
</p-table>
}
```

## Creating our Types

At first glance, I noticed the use of `any` within the component code. I 
wanted to create some types, so we can get some type-safety from
TypeScript, and allow other developers to better understand the code
that they are looking at.

To tackle the first issue, I took a look at the data that the API was 
returning. Opening up `https://reqres.in/api/users?page=1` in the browser
returns the following (I shortened the `data` for brevity):

```json
{
    "page": 1,
    "per_page": 6,
    "total": 12,
    "total_pages": 2,
    "data": [
        {
            "id": 1,
            "email": "george.bluth@reqres.in",
            "first_name": "George",
            "last_name": "Bluth",
            "avatar": "https://reqres.in/img/faces/1-image.jpg"
        },
        {
            "id": 2,
            "email": "janet.weaver@reqres.in",
            "first_name": "Janet",
            "last_name": "Weaver",
            "avatar": "https://reqres.in/img/faces/2-image.jpg"
        },
      ...
    ],
    "support": {
        "url": "https://reqres.in/#support-heading",
        "text": "To keep ReqRes free, contributions towards server costs are appreciated!"
    }
}
```

Next, I created a `models.ts` file with some types for these:

```ts
export type User = {
  id: number;
  email: string;
  first_name: string;
  last_name: string;
  avatar: string;
};

export type UserResponse = {
  page: number;
  per_page: number;
  total: number;
  total_pages: number;
  data: User[];
  support: {
    url: string;
    text: string;
  };
};
```

I updated the start of the component with the types:

```ts
export class SnackBarOverviewExample {
  public data: User[]; // <-- Updated from 'any'
  public isLoading: boolean = false;
  public selectedItem: number; // <-- Updated from 'any' - it is the id of the selected user
  public tableData: User[];
  public isTableLoading: boolean = false;
  public isFirstComponentLoaded: boolean = false;

  constructor(private http: HttpClient) {}
  ...
```

## Reactivity

Any time code that is using `subscribe` just to set a property on a component,
there is an easy way to refactor this to be reactive. In the past, we've used
observables, but we can take this a step further and introduce signals here.

Here is the original initialization hook again:

```ts
ngOnInit() {
  this.isLoading = true;
  this.http
    .get('https://reqres.in/api/users?page=1')
    .pipe(delay(2000))
    .subscribe({
      next: (response: any) => {
        this.data = response.data;
        this.selectedItem = this.data[0].id; //default item
        this.isLoading = false;
        this.isFirstComponentLoaded = true;
      },
    });
}
```

What is happening within the `subscribe`? We have some finalization code,
such as setting `isLoading` to `false`, as well as setting our selected item
in the dropdown to the first item in the returned data.

We're also setting the component's `data` property to the `data` property on the
`response` object, essentially creating a `map`.

Let's refactor `isLoading` to be a boolean signal, and pull this code out of the 
initialization hook and remove the manual subscription. 

By setting the default value of the `isLoading` signal to `true`, we get rid of the 
need to set it to `true` at the start of our data fetch. We know that we are always
loading when this component is first initialized.

We've also added a type hint to our `http.get` in order to get typechecking
for the operators that we will be using, as well as the type for the `data` property.

One other change I made was to remove all the uses of the `public` keyword. 
Properties are `public` by default.

```ts
@Component({
  ...
})
export class SnackBarOverviewExample {
  
  // Updated the data property to be an http response observable
  data = this.http.get<UserResponse>('https://reqres.in/api/users?page=1').pipe(
    delay(2000)
  );
  
  isLoading = signal(true); // <-- Updated to a boolean signal, default to true
  ...
}
```

Let's use the [map operator](https://rxjs.dev/api/index/function/map) to get the `data`
property off of the `results` that are returned from the API. We can use the `tap`
operator to handle any side effects after we are done loading.

```ts
@Component({
  ...
})
export class SnackBarOverviewExample {
  
  // Updated the data property to be an http response observable
  data = this.http.get<UserResponse>('https://reqres.in/api/users?page=1').pipe(
    delay(2000),
    map(response => response.data), // <- Map the `data` property off of the `response` object
    
    // Side effects
    tap(() => {
      this.isLoading.set(false);
      this.selectedItem = this.data[0].id;
    }),
  );
  ...
}
```

## Converting to Signals

We could introduce the `async` pipe into our template and call it a day here. However,
I'd like to go one step further and lean all-in on signals. Let's convert this
observable stream to a signal using `toSignal`.

```ts
import { toSignal } from '@angular/core/rxjs-interop';

@Component({
  ...
})
export class SnackBarOverviewExample {

  // Wraping the existing observable in `toSignal`
  data = toSignal(this.http
    .get<UserResponse>('https://reqres.in/api/users?page=1')
    .pipe(
      delay(2000),
      map((response) => response.data),
      tap((users) => {
        console.log(users);
        this.isLoading.set(false);
        this.selectedItem = users[0].id
      })
    ));

  isLoading = signal(true);
...
}
```

Let's update the template to use both the `data` and `isLoading` signals. Make sure to 
use the `()` notation to get the value _from_ the signal!

```html
@if (isLoading()) {
<p-progressSpinner ariaLabel="loading" />
} @else {
<p-dropdown
  [options]="data()" 
  optionLabel="first_name"
  optionValue="id"
  [(ngModel)]="selectedItem"
  (ngModelChange)="test()"
/>
} 
```

## Reactive Forms

The next thing I want to tackle is moving to 
[Reactive Forms](https://angular.dev/guide/forms/reactive-forms). This will 
simplify our template a little, and make it so we no longer have an 
imperative function (`test()`) to call every time the value of our user
select box changes.

Let's create a `Form Control`.

```ts
// Import the FormControl and ReactiveFormsModule
import { FormControl, ReactiveFormsModule } from '@angular/forms';

@Component({
  ...
    // Update the imports array to use the ReactiveFormsModule
  imports: [DropdownModule, ReactiveFormsModule, ProgressSpinnerModule, TableModule],
})
export class SnackBarOverviewExample {
  data = toSignal(this.http
    .get<UserResponse>('https://reqres.in/api/users?page=1')
    .pipe(
      delay(2000),
      map((response) => response.data),
      tap((users) => {
        console.log(users);
        this.isLoading.set(false);
        this.selectedItem.setValue(users[0].id); // Updated to use `setValue`
      })
    ));
  isLoading = signal(true);
  selectedItem = new FormControl(); // changed from `any` type
...
}
```

And let's update the template:

```html
@if (isLoading()) {
<p-progressSpinner ariaLabel="loading" />
} @else {
<p-dropdown
  [options]="data()"
  optionLabel="first_name"
  optionValue="id"
  [formControl]="selectedItem"
/>
} 
```

Notice that we are now using `[formControl]` instead of `[(ngModel)]`, and also
that the `(ngModelChange)` event is also removed. We will handle the change event
using an observable!

Let's take a look at the existing handler to see what needs to be done in our
observable.

```ts
test() {
  this.isTableLoading = true;
  this.http
    .get('https://reqres.in/api/users?page=1')
    .pipe(delay(2000))
    .subscribe({
      next: (response: any) => {
        this.data = response.data;
        this.tableData = this.data.filter(
          (item: any) => item.id == this.selectedItem
        );
        this.isTableLoading = false;
      },
    });
}
```

Much like the other observable, we should try our best to avoid using `subscribe`.
Using `subscribe` is not _always_ avoidable, but when we use it, we also must
make sure we are destroying the observable when the component is destroyed.

Using the `async pipe` or `toSignal()` like we did earlier, allows us to hand
off that responsibility to the framework.

One thing I noticed was that this event handler was hitting the same exact
API endpoint as before. If we want to make sure the data is up-to-date, we should
instead hit an endpoint for the specific user id, instead of fetching all of them
and then writing code to filter down to the selected user.

For example, this endpoint returns the data for user id 3:

> https://reqres.in/api/users/3

```json
{
    "data": {
        "id": 3,
        "email": "emma.wong@reqres.in",
        "first_name": "Emma",
        "last_name": "Wong",
        "avatar": "https://reqres.in/img/faces/3-image.jpg"
    },
    "support": {
        "url": "https://reqres.in/#support-heading",
        "text": "To keep ReqRes free, contributions towards server costs are appreciated!"
    }
}
```

This data is similar to the response we get for a list of users. Let's update our `models.ts` file.

```ts
export type Support = {
  url: string;
  text: string;
}

export type User = {
  id: number;
  email: string;
  first_name: string;
  last_name: string;
  avatar: string;
};

export type UserListResponse = {
  data: User[];
  page: number;
  per_page: number;
  support: Support;
  total: number;
  total_pages: number;
};

export type UserResponse = {
  data: User;
  support: Support;
}
```

We now have two different response objects, `UserListResponse` for the list of
users, and `UserResponse` for a single user object.

## Triggering the Table Refresh Reactively

We do not want to imperatively tell our code every time we want to refresh the table
data. Instead, we want our code to _react_ to something. Let's react to the change
in our form control.

```ts
tableData = this.selectedItem.valueChanges.pipe(
  ...
)
```

We now have an observable that is triggered every time the `selectedItem` form
control is changed. 

The observable should be the data returned from the API, and not the value that
is changed in the dropdown. [switchMap](https://rxjs.dev/api/index/function/switchMap)
will give us the ability to switch from this value to our http request.

```ts
tableData = this.selectedItem.valueChanges.pipe(
  switchMap((id) => this.http.get<UserResponse>(`https://reqres.in/api/users/${id}`)),
  delay(2000),
)
```

We have also given our `http.get` the type of our expected response, and brought
in the `delay` operator to simulate a slow connection, allowing us to test the
loading spinners properly.

At this point, the `tableData` is of type `Observable<UserResponse>`. Let's map 
the response into the data we need.

```ts
tableData = this.selectedItem.valueChanges.pipe(
  switchMap((id) => this.http.get<UserResponse>(`https://reqres.in/api/users/${id}`)),
  delay(2000),
  map(response => response.data)
)
```

Now, it is of type `Observable<User>`. A couple more things here... The table is expecting
that we provide it an `array` of users. Even though we are only showing one user, 
we need that array for the [PrimeNG Table Component](https://primeng.org/table).

Also, we need to set the loading indicator at the start and end of the pipe. Let's set
`isTableLoading` to be a signal while we are at it. And finally, let's wrap this in a 
`toSignal()` function!

```ts
tableData = toSignal(this.selectedItem.valueChanges.pipe(
  tap(() => this.isTableLoading.set(true)),
  switchMap((id) => this.http.get<UserResponse>(`https://reqres.in/api/users/${id}`)),
  delay(2000),
  map(response => [response.data]),
  tap(() => this.isTableLoading.set(false)),
));
isTableLoading = signal(false);
```

Let's update the template:

```html
@if (isTableLoading()) {
<p-progressSpinner ariaLabel="loading" />
} @else {
<p-table [value]="tableData() ?? []">
  <ng-template pTemplate="header">
    <tr>
      <th>ID</th>
      <th>Email</th>
    </tr>
  </ng-template>
  <ng-template pTemplate="body" let-data>
    <tr>
      <td>{{data.id}}</td>
      <td>{{data.email}}</td>
    </tr>
  </ng-template>
</p-table>
}
```

## Using Computed Signals

Currently, our template has two loading spinners, one for the user select
and one for when the table is loading. We never have a state where
both are loading at the same time, so we can combine these into a single
computed signal.

Let's rename `isLoading` to `isUserListLoading`, and then create a computed
property `isLoading` when either the user list _or_ the table is loading data.

```ts
isUserListLoading = signal(true);
isTableLoading = signal(false);
isLoading = computed(() => this.isTableLoading() || this.isUserListLoading());
```

Let's simplify the template a bit.

```html
@if (data()?.length) {
<p-dropdown
  [options]="data()"
  optionLabel="first_name"
  optionValue="id"
  [formControl]="selectedItem"
/>
} 

@if(tableData() && !isTableLoading()) {
<p-table [value]="tableData() ?? []">
  <ng-template pTemplate="header">
    <tr>
      <th>ID</th>
      <th>Email</th>
    </tr>
  </ng-template>
  <ng-template pTemplate="body" let-data>
    <tr>
      <td>{{data.id}}</td>
      <td>{{data.email}}</td>
    </tr>
  </ng-template>
</p-table>
}

@if (isLoading()) {
<p-progressSpinner ariaLabel="loading" />
} 
```

I've rearranged a few things, and updated the logic using these signals. This
will allow us to use only one progress spinner, as well as fixing the issue
where during the initial load, a blank table is shown while the user list is
being loaded.

## Moving the Http Calls to a Service

Lastly, I'd like to move our http calls to a reusable service, allowing
other components (not yet created) to utilize these easily.

```ts
@Injectable({ providedIn: 'root' })
export default class DataService {
  private http = inject(HttpClient);

  getUserList = this.http.get<UserListResponse>(
    'https://reqres.in/api/users?page=1'
  );

  getUserData = (id: number) =>
    this.http.get<UserResponse>(`https://reqres.in/api/users/${id}`);
}
```

Now, we simply inject this service, and update our component code. Here is the final
component code.

```ts
export class SignalsExampleComponent {
  dataService = inject(DataService);

  isTableLoading = signal(false);
  isUserListLoading = signal(true);
  isLoading = computed(() => this.isTableLoading() || this.isUserListLoading());

  selectedItem = new FormControl();

  data = toSignal(
    this.dataService.getUserList.pipe(
      delay(2000),
      map((response) => response.data),
      tap((users) => {
        this.isUserListLoading.set(false);
        this.selectedItem.setValue(users[0].id);
      })
    )
  );

  tableData = toSignal(
    this.selectedItem.valueChanges.pipe(
      tap(() => this.isTableLoading.set(true)),
      switchMap((id) => this.dataService.getUserData(id)),
      delay(2000),
      map((response) => [response.data]),
      tap(() => this.isTableLoading.set(false))
    )
  );
}
```

> [The code used in this tutorial can be found here.](https://stackblitz.com/edit/nnvvmu-bg53ey?file=src%2Fexample-signals%2Fexample-signals.ts)
