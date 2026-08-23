using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace server.Migrations.CashBookAuthDb
{
    public partial class AddCurrencyToUser : Migration
    {
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<string>(
                name: "Currency",
                table: "AspNetUsers",
                type: "nvarchar(max)",
                nullable: false,
                defaultValue: "");
        }

        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "Currency",
                table: "AspNetUsers");
        }
    }
}
