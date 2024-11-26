namespace server.Models
{
    public class DynamicForm
    {
            public string Name { get; set; }
            public string Label { get; set; }
            public string Placeholder { get; set; }
            public string Hint { get; set; }
            public bool? Required { get; set; } // Nullable in case it is not always present
            public string InputControlType { get; set; }
            public string ControlValue { get; set; } // Optional: it might not be present in all cases
            public List<string> Options { get; set; } // Optional: used for dropdown or multiselect
            
            public Location Location { get; set; }
            public Size Size { get; set; }
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
}
