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
                #region Row1
                new DynamicForm
                {
                    Name = "ItemType",
                    Label = "Item Type",
                    Placeholder = "Item Type",
                    Hint = "",
                    InputControlType = "dropdown",
                    DefaultValue = null,
                    Required = true,
                    Location = new Location { x = 0, y = 0 },
                    Size = new Size { Height = 40, Width = 175 },
                    ValidValues = new List<ValidValues>
                    {
                        new ValidValues { Value = "PLNSUP", Description = "PLNSUP" },
                        new ValidValues { Value = "PLNSUP2", Description = "PLNSUP2" },
                        new ValidValues { Value = "PLNSUP3", Description = "PLNSUP3" },
                    }
                },
                new DynamicForm
                {
                    Name = "SubType",
                    Label = "Subtype",
                    Placeholder = "POOLED - Poo",
                    Required = true,
                    Hint = "",
                    InputControlType = "dropdown",
                    DefaultValue = null,
                    Location = new Location { x = 200, y = 0 },
                    Size = new Size { Height = 40, Width = 175 },
                    ValidValues = new List<ValidValues>
                    {
                        new ValidValues { Value = "PLNSUP", Description = "PLNSUP" },
                        new ValidValues { Value = "PLNSUP2", Description = "PLNSUP2" },
                        new ValidValues { Value = "PLNSUP3", Description = "PLNSUP3" },
                    }
                },
                new DynamicForm
                {
                    Name = "Communication",
                    Label = "Communication T",
                    Placeholder = "INTERN - Inter.",
                    Hint = "",
                    InputControlType = "dropdown",
                    DefaultValue = null,
                    Location = new Location { x = 600, y = 0 },
                    Size = new Size { Height = 40, Width = 175 },
                    ValidValues = new List<ValidValues>
                    {
                        new ValidValues { Value = "PLNSUP", Description = "PLNSUP" },
                        new ValidValues { Value = "PLNSUP2", Description = "PLNSUP2" },
                        new ValidValues { Value = "PLNSUP3", Description = "PLNSUP3" },
                    }
                },
                new DynamicForm
                {
                    Name = "Status",
                    Label = "Status",
                    Placeholder = "INPROC - In",
                    Required = true,
                    Hint = "",
                    InputControlType = "dropdown",
                    DefaultValue = null,
                    Location = new Location { x = 800, y = 0 },
                    Size = new Size { Height = 40, Width = 175 },
                    ValidValues = new List<ValidValues>
                    {
                        new ValidValues { Value = "PLNSUP", Description = "PLNSUP" },
                        new ValidValues { Value = "PLNSUP2", Description = "PLNSUP2" },
                        new ValidValues { Value = "PLNSUP3", Description = "PLNSUP3" },
                    }
                },
                #endregion
                #region Row2
                new DynamicForm
                {
                    Name = "PlanNumber",
                    Label = "Plan Number",
                    Required = true,
                    Placeholder = "",
                    Hint = "",
                    InputControlType = "textbox",
                    DefaultValue = null,
                    Location = new Location { x = 0, y = 75 },
                    Size = new Size { Height = 40, Width = 175 },
                },
                new DynamicForm
                {
                    Name = "ClientId",
                    Label = "Client ID",
                    Placeholder = "",
                    Hint = "",
                    InputControlType = "textbox",
                    DefaultValue = null,
                    Location = new Location { x = 200, y = 75 },
                    Size = new Size { Height = 40, Width = 175 }
                },
                new DynamicForm
                {
                    Name = "Organization",
                    Label = "Organization",
                    Placeholder = "",
                    Hint = "",
                    InputControlType = "textbox",
                    DefaultValue = null,
                    Location = new Location { x = 400, y = 75 },
                    Size = new Size { Height = 40, Width = 350 },
                },
                new DynamicForm
                {
                    Name = "MarketCode",
                    Label = "Market Code",
                    Required = true,
                    Placeholder = "Item Type",
                    Hint = "",
                    InputControlType = "dropdown",
                    DefaultValue = null,
                    Location = new Location { x = 800, y = 75 },
                    Size = new Size { Height = 40, Width = 175 },
                    ValidValues = new List<ValidValues>
                    {
                        new ValidValues { Value = "PLNSUP", Description = "PLNSUP" },
                        new ValidValues { Value = "PLNSUP2", Description = "PLNSUP2" },
                        new ValidValues { Value = "PLNSUP3", Description = "PLNSUP3" },
                    }
                },
                new DynamicForm
                {
                    Name = "PlanType",
                    Label = "Plan Type",
                    Required = true,
                    Placeholder = "",
                    Hint = "",
                    InputControlType = "dropdown",
                    DefaultValue = null,
                    Location = new Location { x = 1000, y = 75 },
                    Size = new Size { Height = 40, Width = 175 },
                    ValidValues = new List<ValidValues>
                    {
                        new ValidValues { Value = "PLNSUP", Description = "PLNSUP" },
                        new ValidValues { Value = "PLNSUP2", Description = "PLNSUP2" },
                        new ValidValues { Value = "PLNSUP3", Description = "PLNSUP3" },
                    }
                },
                new DynamicForm
                {
                    Name = "Product",
                    Label = "Product",
                    Placeholder = "DC- D",
                    Required = true,
                    Hint = "",
                    InputControlType = "dropdown",
                    DefaultValue = null,
                    Location = new Location { x = 1200, y = 75 },
                    Size = new Size { Height = 40, Width = 175 },
                    ValidValues = new List<ValidValues>
                    {
                        new ValidValues { Value = "PLNSUP", Description = "PLNSUP" },
                        new ValidValues { Value = "PLNSUP2", Description = "PLNSUP2" },
                        new ValidValues { Value = "PLNSUP3", Description = "PLNSUP3" },
                    }
                },
                #endregion
                #region Row3
                   new DynamicForm
                {
                    Name = "EntryAssociate",
                    Label = "Entry Associate",
                    Placeholder = "",
                    Hint = "",
                    InputControlType = "textbox",
                    DefaultValue = null,
                    Required = true,
                    Location = new Location { x = 0, y = 150 },
                    Size = new Size { Height = 40, Width = 175 },
                   
                },
                new DynamicForm
                {
                    Name = "Extension",
                    Label = "Extension",
                    Placeholder = "",
                    Required = true,
                    Hint = "",
                    InputControlType = "textbox",
                    DefaultValue = null,
                    Location = new Location { x = 200, y = 150 },
                    Size = new Size { Height = 40, Width = 175 }
                },
                new DynamicForm
                {
                    Name = "EntryAssociateDept",
                    Label = "Entry Associate Dept",
                    Placeholder = "",
                    Hint = "",
                    InputControlType = "dropdown",
                    DefaultValue = null,
                    Location = new Location { x = 400, y = 150 },
                    Size = new Size { Height = 40, Width = 175 },
                    ValidValues = new List<ValidValues>
                    {
                        new ValidValues { Value = "PLNSUP", Description = "PLNSUP" },
                        new ValidValues { Value = "PLNSUP2", Description = "PLNSUP2" },
                        new ValidValues { Value = "PLNSUP3", Description = "PLNSUP3" },
                    }
                },
                new DynamicForm
                {
                    Name = "EffectiveDate",
                    Label = "Effective Date",
                    Placeholder = "",
                    Required = true,
                    Hint = "",
                    InputControlType = "dropdown",
                    DefaultValue = null,
                    Location = new Location { x = 600, y = 150 },
                    Size = new Size { Height = 40, Width = 175 },
                },
                #endregion
                #region Row4
                   new DynamicForm
                {
                    Name = "TOAOnlyPlan",
                    Label = "TOA Only Plan",
                    Placeholder = "Item Type",
                    Hint = "",
                    InputControlType = "dropdown",
                    DefaultValue = null,
                    Required = true,
                    Location = new Location { x = 0, y = 225 },
                    Size = new Size { Height = 40, Width = 175 },
                    ValidValues = new List<ValidValues>
                    {
                        new ValidValues { Value = "PLNSUP", Description = "PLNSUP" },
                        new ValidValues { Value = "PLNSUP2", Description = "PLNSUP2" },
                        new ValidValues { Value = "PLNSUP3", Description = "PLNSUP3" },
                    }
                },
                new DynamicForm
                {
                    Name = "SamplePlanX3",
                    Label = "Sample Plan X3",
                    Placeholder = "",
                    Required = true,
                    Hint = "",
                    InputControlType = "dropdown",
                    DefaultValue = null,
                    Location = new Location { x = 200, y = 225 },
                    Size = new Size { Height = 40, Width = 175 },
                    ValidValues = new List<ValidValues>
                    {
                        new ValidValues { Value = "PLNSUP", Description = "PLNSUP" },
                        new ValidValues { Value = "PLNSUP2", Description = "PLNSUP2" },
                        new ValidValues { Value = "PLNSUP3", Description = "PLNSUP3" },
                    }
                },
                new DynamicForm
                {
                    Name = "PlanNumberRequest",
                    Label = "Plan Number Request",
                    Placeholder = "INTERN - Inter.",
                    Hint = "",
                    Required = true,
                    InputControlType = "dropdown",
                    DefaultValue = null,
                    Location = new Location { x = 600, y = 225 },
                    Size = new Size { Height = 40, Width = 175 },
                    ValidValues = new List<ValidValues>
                    {
                        new ValidValues { Value = "PLNSUP", Description = "PLNSUP" },
                        new ValidValues { Value = "PLNSUP2", Description = "PLNSUP2" },
                        new ValidValues { Value = "PLNSUP3", Description = "PLNSUP3" },
                    }
                },
                new DynamicForm
                {
                    Name = "CRMID",
                    Label = "CRM ID",
                    Placeholder = "",
                    Hint = "",
                    InputControlType = "textbox",
                    DefaultValue = null,
                    Location = new Location { x = 800, y = 225 },
                    Size = new Size { Height = 40, Width = 175 },
                },
                #endregion
                #region Row5
                //new DynamicForm
                //{
                //    Name = "ItemType",
                //    Label = "Item Type",
                //    Placeholder = "Item Type",
                //    Hint = "",
                //    InputControlType = "dropdown",
                //    DefaultValue = null,
                //    Required = true,
                //    Location = new Location { x = 0, y = 300 },
                //    Size = new Size { Height = 40, Width = 175 },
                //    ValidValues = new List<ValidValues>
                //    {
                //        new ValidValues { Value = "PLNSUP", Description = "PLNSUP" },
                //        new ValidValues { Value = "PLNSUP2", Description = "PLNSUP2" },
                //        new ValidValues { Value = "PLNSUP3", Description = "PLNSUP3" },
                //    }
                //},
                //new DynamicForm
                //{
                //    Name = "SubType",
                //    Label = "Subtype",
                //    Placeholder = "POOLED - Poo",
                //    Required = true,
                //    Hint = "",
                //    InputControlType = "dropdown",
                //    DefaultValue = null,
                //    Location = new Location { x = 200, y = 300 },
                //    Size = new Size { Height = 40, Width = 175 },
                //    ValidValues = new List<ValidValues>
                //    {
                //        new ValidValues { Value = "PLNSUP", Description = "PLNSUP" },
                //        new ValidValues { Value = "PLNSUP2", Description = "PLNSUP2" },
                //        new ValidValues { Value = "PLNSUP3", Description = "PLNSUP3" },
                //    }
                //},
                //new DynamicForm
                //{
                //    Name = "Communication",
                //    Label = "Communication T",
                //    Placeholder = "INTERN - Inter.",
                //    Hint = "",
                //    InputControlType = "dropdown",
                //    DefaultValue = null,
                //    Location = new Location { x = 600, y = 300 },
                //    Size = new Size { Height = 40, Width = 175 },
                //    ValidValues = new List<ValidValues>
                //    {
                //        new ValidValues { Value = "PLNSUP", Description = "PLNSUP" },
                //        new ValidValues { Value = "PLNSUP2", Description = "PLNSUP2" },
                //        new ValidValues { Value = "PLNSUP3", Description = "PLNSUP3" },
                //    }
                //},
                //new DynamicForm
                //{
                //    Name = "Status",
                //    Label = "Status",
                //    Placeholder = "INPROC - In",
                //    Required = true,
                //    Hint = "",
                //    InputControlType = "dropdown",
                //    DefaultValue = null,
                //    Location = new Location { x = 800, y = 300 },
                //    Size = new Size { Height = 40, Width = 175 },
                //    ValidValues = new List<ValidValues>
                //    {
                //        new ValidValues { Value = "PLNSUP", Description = "PLNSUP" },
                //        new ValidValues { Value = "PLNSUP2", Description = "PLNSUP2" },
                //        new ValidValues { Value = "PLNSUP3", Description = "PLNSUP3" },
                //    }
                //},
                #endregion

            };

            return Ok(dynamicForms);
        }

    }
}
