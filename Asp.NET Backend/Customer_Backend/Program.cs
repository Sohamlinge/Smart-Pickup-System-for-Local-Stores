using CustomerApp.Data;
using Microsoft.EntityFrameworkCore;
using Steeltoe.Discovery.Client;
using System.Text.Json.Serialization;

var builder = WebApplication.CreateBuilder(args);
// Add Steeltoe Discovery Client
builder.Services.AddDiscoveryClient(builder.Configuration);

// ✅ Register DbContext with MySQL (Pomelo)
var connectionString = builder.Configuration.GetConnectionString("DefaultConnection");
builder.Services.AddDbContext<AppDbContext>(options =>
    options.UseMySql(connectionString, ServerVersion.AutoDetect(connectionString)));

// ✅ Add CORS policy to allow frontend
//builder.Services.AddCors(options =>
//{
//    options.AddPolicy("AllowFrontend",
//        policy =>
//        {
//            policy.WithOrigins("http://localhost:5173") // Vite/React dev server
//                  .AllowAnyHeader()
//                  .AllowAnyMethod();
//        });
//});

// ✅ Add controllers with JSON cycle handler
builder.Services.AddControllers()
    .AddJsonOptions(x =>
        x.JsonSerializerOptions.ReferenceHandler = ReferenceHandler.IgnoreCycles);

// ✅ Swagger
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();

var app = builder.Build();
// Use Steeltoe Discovery Client
app.UseDiscoveryClient();

// ✅ Use CORS before everything else that uses routing
//app.UseCors("AllowFrontend");

if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI();
}

//Comment following code
//app.UseHttpsRedirection();

app.UseAuthorization();
app.MapControllers();
app.Run();
