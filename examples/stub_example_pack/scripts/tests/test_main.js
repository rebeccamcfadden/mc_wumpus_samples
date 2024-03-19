import * as mc from "@minecraft/server";
import Utility from "../utilities";

// include all test classes here
import SampleTestClass from "./sample_test_class";
import DataImporterTestClass from "./example_data_tests";

export default class TestRunner {
    // this class is used to initialize tests to verify that the script is working as expected
    // to run a test, use the /scriptevent wumpus:test <test_name> command

    static init() {
        // initialize the test runner
        TestRunner.registerTests();
        Utility.sendDebugMessage("TestRunner initialized");
    }

    static registerTests() {
        SampleTestClass.registerTests(TestRunner.testRegistry);
        DataImporterTestClass.registerTests(TestRunner.testRegistry);
        // register any other test classes here
    }

    static listTests() {
        // list all available tests
        let tests = Array.from(TestRunner.testRegistry.keys());
        mc.world.sendMessage('Registered tests: ' + tests.length);
        mc.world.sendMessage('Available tests:\n ' + tests.join('\n '));
    }

    static runTest(test) {
        // run a specific test
        let testFunction = TestRunner.testRegistry.get(test);
        if (testFunction) {
            mc.world.sendMessage('Running test "' + test + '"...');
            try {
                let result = testFunction();
                if (result) {
                    mc.world.sendMessage('- passed');
                }
                else {
                    mc.world.sendMessage('- failed');
                }
            }
            catch (e) {
                mc.world.sendMessage('- error:' + e);
            }
        }
        else {
            mc.world.sendMessage('Test "' + test + '" not found.');
        }
    }
}

// the testRegistry is a map of test names to test functions
// all test functions should return a boolean value
TestRunner.testRegistry = new Map();
