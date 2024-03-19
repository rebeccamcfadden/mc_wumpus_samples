import * as mc from "@minecraft/server";
import Utility from "../utilities";
export default class SampleTestClass {
    static registerTests(testRegistry) {
        testRegistry.set("SampleTestClass::sampleTest1", SampleTestClass.sampleTest1);
        testRegistry.set("SampleTestClass::sampleTest2", SampleTestClass.sampleTest2);
    }
    static sampleTest1() {
        return Utility.assert(true, 'This is a sample test');
    }
    static sampleTest2() {
        let players = mc.world.getPlayers();
        return Utility.assert(players.length > 0, 'No players found');
    }
}
