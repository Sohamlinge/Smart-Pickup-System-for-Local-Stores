using System.Text.Json.Serialization;
using Admin_Login;
using Admin_Login.Data;
using Microsoft.EntityFrameworkCore;
using Steeltoe.Discovery.Client;

namespace Admin_Login
{
    public class Program
    {
        public static void Main(string[] args)
        {
            var builder = WebApplication.CreateBuilder(args);

            // Add services with JSON options to ignore cycles
            builder.Services.AddControllers()
                .AddJsonOptions(options =>
                {
                    options.JsonSerializerOptions.ReferenceHandler = ReferenceHandler.IgnoreCycles;
                    options.JsonSerializerOptions.DefaultIgnoreCondition = JsonIgnoreCondition.WhenWritingNull;
                });
            // Add Steeltoe Discovery Client
            builder.Services.AddDiscoveryClient(builder.Configuration);



            // Swagger/OpenAPI
            builder.Services.AddEndpointsApiExplorer();
            builder.Services.AddSwaggerGen();

            //// CORS for frontend
            //builder.Services.AddCors(options =>
            //{
            //    options.AddPolicy("AllowViteApp", policy =>
            //    {
            //        policy.WithOrigins("http://localhost:5173")
            //              .AllowAnyHeader()
            //              .AllowAnyMethod();
            //    });
            //});

            // MySQL DB Context
            builder.Services.AddDbContext<AppDbContext>(options =>
                options.UseMySql(
                    builder.Configuration.GetConnectionString("DefaultConnection"),
                    new MySqlServerVersion(new Version(8, 0, 29))
                ));

            var app = builder.Build();

            if (app.Environment.IsDevelopment())
            {
                app.UseDeveloperExceptionPage();
                app.UseSwagger();
                app.UseSwaggerUI();
            }

            //app.UseHttpsRedirection();
            // Use Steeltoe Discovery Client
            app.UseDiscoveryClient();

            //app.UseCors("AllowViteApp");

            app.UseStaticFiles();

            app.UseAuthorization();

            app.MapControllers();

            app.Run();
        }
    }
}
