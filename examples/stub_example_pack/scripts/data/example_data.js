// to display json data string as multi-line string in typescript, use the following format with \ to escape the newlines
export const employeeData = '{ \
  "employees" : [\
    { \
      "firstName":"John",\
      "lastName":"Doe"\
    },\
    {\
      "firstName":"Anna",\
      "lastName":"Smith"\
    },\
    {\
      "firstName":"Peter",\
      "lastName":"Jones"\
    }\
  ]\
}';
// or you can leave the data as a single line and use the following format
export const sampleData = '{"fruits":["apple","banana","pear"],"colors":{"red":"#FF0000","green":"#00FF00","blue":"#0000FF","yellow":"#FFFF00"},"obj1":{"value1":"nested_value","array_value":[1,2,3],"obj2":{"value2":"nested_value2"}}}';
