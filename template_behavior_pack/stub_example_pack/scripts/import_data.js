import Utility from "./utilities";

// include other data exports here
import { employeeData, sampleData } from "./data/example_data";

export default class DataImporter {
    // this class is used to demonstrate how to import data from js data files
    static getSampleData() {
        try {
            let data = JSON.parse(sampleData);
            return data;
        }
        catch (e) {
            Utility.sendDebugMessage('Error parsing sample data: ' + e);
        }
    }

    static getEmployeeData() {
        try {
            let data = JSON.parse(employeeData);
            return data;
        }
        catch (e) {
            Utility.sendDebugMessage('Error parsing employee data: ' + e);
        }
    }
    
    static getEmployeeNames() {
        let employees = DataImporter.getEmployeeData().employees;
        let names = [];
        for (let i = 0; i < employees.length; i++) {
            names.push(employees[i].firstName + ' ' + employees[i].lastName);
        }
        return names;
    }
}
