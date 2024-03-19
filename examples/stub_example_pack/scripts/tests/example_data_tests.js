import Utility from "../utilities";
import DataImporter from "../import_data";
export default class DataImporterTestClass {
    static registerTests(testRegistry) {
        testRegistry.set("DataImporterTestClass::sampleDataTest", DataImporterTestClass.sampleDataTest);
        testRegistry.set("DataImporterTestClass::employeeDataTest", DataImporterTestClass.employeeDataTest);
    }
    static sampleDataTest() {
        let sampleData = DataImporter.getSampleData();
        let result = true;
        result = result && Utility.assert(sampleData !== undefined, 'Sample data not found');
        result = result && Utility.assert(sampleData.fruits.length === 3, 'Should have 3 fruits in sample data');
        result = result && Utility.assert(!(sampleData.colors instanceof Array), 'Colors should not be an array');
        result = result && Utility.assert(sampleData.colors.red === '#FF0000', 'Red should be #FF0000');
        result = result && Utility.assert(sampleData.obj1.value1 === 'nested_value', 'Value1 should be nested_value');
        result = result && Utility.assert(sampleData.obj1.array_value.length === 3, 'Array_value should have 3 elements');
        result = result && Utility.assert(sampleData.obj1.obj2.value2 === 'nested_value2', 'Value2 should be nested_value2');
        return result;
    }
    static employeeDataTest() {
        let employees = DataImporter.getEmployeeData().employees;
        let employeeNames = DataImporter.getEmployeeNames();
        let result = true;
        result = result && Utility.assert(employees !== undefined, 'Employee data not found');
        result = result && Utility.assert(employees.length === 3, 'Should have 3 employees');
        result = result && Utility.assert(employeeNames !== undefined, 'Employee names not found');
        result = result && Utility.assert(employeeNames.length === 3, 'Should have 3 employee names');
        result = result && Utility.assert(employeeNames[0] === (employees[0].firstName + ' ' + employees[0].lastName), 'First employee should be ' + employees[0].firstName + ' ' + employees[0].lastName);
        return result;
    }
}
