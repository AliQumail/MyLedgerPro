using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using server.Models;
using server.Repositories.CustomerRepository;

namespace server.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class FormsController : ControllerBase
    {
        [HttpGet]
        [Route("GetDynamicForms")]
        public IActionResult GetDynamicForms()
        {
            var dynamicForms = new List<DynamicForm>
            {
                new DynamicForm
                {
                    Name = "firstname",
                    Label = "First Name",
                    Placeholder = "leave empty to see error",
                    Hint = "Use only letters",
                    Required = true,
                    InputControlType = "textbox",
                    ControlValue = "Mike",
                    Location = new Location { x = 100, y = 100 },
                    Size = new Size { Height = 40, Width = 500 }
                },
                new DynamicForm
                {
                    Name = "lastname",
                    Label = "Last Name",
                    Placeholder = "add a number to see error",
                    Hint = "Use only letters",
                    InputControlType = "textbox",
                    Location = new Location { x = 650, y = 100 },
                    Size = new Size { Height = 40, Width = 500 }
                },
                new DynamicForm
                {
                    Name = "age",
                    Label = "Age",
                    Placeholder = "enter an age less than 10 to see error",
                    Hint = "Use only digits",
                    InputControlType = "textbox",
                    Location = new Location { x = 100, y = 300 },
                    Size = new Size { Height = 40, Width = 500 }
                },
                new DynamicForm
                {
                    Name = "country",
                    Label = "Country",
                    Placeholder = "enter your country",
                    Hint = "",
                    InputControlType = "dropdown",
                    Options = new List<string> { "USA", "Canada", "Iran", "Pakistan" },
                    ControlValue = "Iran",
                    Location = new Location { x = 100, y = 400 },
                    Size = new Size { Height = 40, Width = 500 }
                },
                new DynamicForm
                {
                    Name = "food",
                    Label = "Food",
                    Placeholder = "enter your favourite food",
                    Hint = "",
                    InputControlType = "multiselectdropdown",
                    Options = new List<string> { "Pizza", "Burger", "Noodles", "Ice Cream", "Steaks" },
                    Location = new Location { x = 100, y = 500 },
                    Size = new Size { Height = 40, Width = 500 }
                    // Value = new List<string> { "Pizza", "Burger", "Noodles" }
                }
            };

            return Ok(dynamicForms);
        }

    }
}
