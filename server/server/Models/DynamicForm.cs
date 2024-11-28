namespace server.Models
{
    public class DynamicForm
    {
            public string Name { get; set; }
            public string Label { get; set; }
            public string? Placeholder { get; set; }
            public string? Hint { get; set; }
            public bool? Required { get; set; } 
            public string InputControlType { get; set; }
            public string? DefaultValue { get; set; } 
            public List<string>? Options { get; set; }
            
            public Location? Location { get; set; }
            public Size? Size { get; set; }

            public List<ValidValues>? ValidValues { get; set; }
    }

    public class Location 
    {
        public int x { get; set; }
        public int y { get; set; }
    }

    public class Size 
    {
        public int Height { get; set; }
        public int Width { get; set; }

    }

    public class ValidValues 
    {
        public string Value { get; set; }
        public string Description { get; set; }
    }
}
