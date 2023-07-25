import json

# Sample 3-dimensional array
three_dim_array = [
    [[1, 2, 3], [4, 5, 6]],
    [[7, 8, 9], [10, 11, 12]],
    [[13, 14, 15], [16, 17, 18]]
]

# three_dim_array = {"name": "John", "age": 30, "city": "New York"}

print("save", three_dim_array)

f = open("mydata.json", "w")
json.dump(three_dim_array, f, indent=2, sort_keys=True)

f = open("mydata.json")
three_dim_array = json.load(f)
print("load", three_dim_array)
