---
date: 2021-09-14
title: Authorize DotNet Core Web API with JWT with Ease!
image: dotnetcore.png
categories: DotNet Core
tags: dotnet,jwt,core
---

## Getting Started

Let's first start by creating an empty WebAPI project.

```bash
dotnet new webapi MyTestProject
```

This will create a new WebAPI project without any built-in authentication.  We will create a home-made authentication system in another tutorial, but for now we just want to focus on the JWT setup.

Let's first test our new API, hitting the *weatherforecast/* route using PostMan.  This route is provided to you as an example when creating a new WebAPI project.

![PostMan Fetching Weather From the API](/assets/images/jwt-postman-weather.png)

Now that we can see that our basic API route is working, let's protect this route from unauthorized users.  In our **WeatherForecastController.cs** file, let's add the *Authorize* attribute:

```csharp
[ApiController]
[Authorize]
[Route("[controller]")]
public class WeatherForecastController : ControllerBase
{
  ...
```

When we try to get the weather forecast again, we now get a **401 Unauthorized** error from the API.

![Unauthorized Response from WebAPI](/assets/images/jwt-postman-weather-unauthorized.png)

## Setup JWT

Microsoft adds a very handy package to assist in setting up JWTs for your WebAPI.  You will need to install the following package from nuGet:

```bash
Microsoft.AspNetCore.Authentication.JwtBearer
```

You can use the command line or the built-in tools in your IDE if you're using JetBrains Rider or Visual Studio.  To use the command line, run the following:

```bash
dotnet add package Microsoft.AspNetCore.Authentication.JwtBearer
```

Next, let's configure our app settings.  Open up your **appsettings.Development.json** file to get started, and add the details of your JWT.  The following shows an example of the full **appsettings.Development.json** file for reference.

```json
{
  "Logging": {
    "LogLevel": {
      "Default": "Information",
      "Microsoft": "Warning",
      "Microsoft.Hosting.Lifetime": "Information"
    }
  },
  "Jwt": {
    "Key": "ThisismysupersecretJWTkey!",
    "Issuer": "www.chrisperko.net",
    "Audience": "https://localhost:5001/"
  }
}
```

Next, let's modify our *ConfigureServices* method in the **Startup.cs** file.  Here is the full method, everything after the Swagger setup is for JWTs:

```csharp
public void ConfigureServices(IServiceCollection services)
{
    services.AddControllers();
    services.AddSwaggerGen(c =>
    {
        c.SwaggerDoc("v1", new OpenApiInfo { Title = "LearnJwt", Version = "v1" });
    });

    services.AddAuthentication(options =>
    {
        options.DefaultAuthenticateScheme = JwtBearerDefaults.AuthenticationScheme;
        options.DefaultChallengeScheme = JwtBearerDefaults.AuthenticationScheme;
        options.DefaultScheme = JwtBearerDefaults.AuthenticationScheme;
    }).AddJwtBearer(options =>
    {
        options.SaveToken = true;
        options.RequireHttpsMetadata = false;
        options.TokenValidationParameters = new TokenValidationParameters()
        {
            ValidateIssuer = true,
            ValidateAudience = true,
            ValidateLifetime = true,
            ValidateIssuerSigningKey = true,
            ValidIssuer = Configuration["Jwt:Issuer"],
            ValidAudience = Configuration["Jwt:Audience"],
            IssuerSigningKey = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(Configuration["Jwt:Key"]))
        };
    });
}
```

The importan thing to note here is that we are using the settings from our **appsettings** file (**appsettings.Development.json** when we are running locally).  This makes it very easy to modify when setting up your settings for a staging or production environment.

Now, let's update our *Configure* method within the same **Startup.cs** file.  We need to tell it to use **Authentication**, and we can place that just before the **UseAuthorization()** call.  Here is the full method, you only need to add the one line.

```csharp
public void Configure(IApplicationBuilder app, IWebHostEnvironment env)
{
    if (env.IsDevelopment())
    {
        app.UseDeveloperExceptionPage();
        app.UseSwagger();
        app.UseSwaggerUI(c => c.SwaggerEndpoint("/swagger/v1/swagger.json", "LearnJwt v1"));
    }

    app.UseHttpsRedirection();

    app.UseRouting();

    app.UseAuthentication(); # ADD THIS!
    app.UseAuthorization();

    app.UseEndpoints(endpoints => { endpoints.MapControllers(); });
}
```

## Create a Login Endpoint

As I stated earlier, we won't be building out any authentication logic.  We simply need to create an API endpoint that can take a given username (which we will not be checking if it exists), and pass back a valid JWT token for this user.  The user can then use that JWT token to get their weather forecast.

Create a new controller, let's call it **LoginController.cs**.  We will add a *Login* method which takes a username, and creates a JWT token for it.

```csharp
using System;
using System.Collections.Generic;
using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Text;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Configuration;
using Microsoft.IdentityModel.Tokens;

namespace LearnJwt.Controllers
{
    [ApiController]
    [Route("[controller]")]
    public class LoginController : ControllerBase
    {
        private IConfiguration _config;

        public LoginController(IConfiguration config)
        {
            _config = config;
        }

        [HttpGet]
        public string Get(string username)
        {
            var authClaims = new List<Claim>
            {
                new(ClaimTypes.Name, username)
            };
            var authSigningKey = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(_config["Jwt:Key"]));

            var token = new JwtSecurityToken(
                issuer: _config["Jwt:Issuer"],
                audience: _config["Jwt:Audience"],
                expires: DateTime.Now.AddHours(3),
                claims: authClaims,
                signingCredentials: new SigningCredentials(authSigningKey, SecurityAlgorithms.HmacSha256)
            );

            return new JwtSecurityTokenHandler().WriteToken(token);
        }
    }
}
```

Let's test it out!  Let's point PostMan to our Login route and pass in a username (I used 'chris').  Our response is our new JWT token for this user!

![Getting our Token](/assets/images/jwt-postman-get-token.png)

We can then use that token to fetch the weather forecast by using it in the authorization tab within PostMan.

![Getting the Forecast with the JWT Token](/assets/images/jwt-postman-forecast-with-token.png)
