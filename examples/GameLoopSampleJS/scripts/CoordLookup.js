import * as mc from "@minecraft/server";
// Internal helper class
class Vector2 {
    constructor(x, z) {
        this.x = x;
        this.z = z;
        this.isValid = true;
    }
}
export default class CoordinateLookup {
    // Initialize the mapping table with a maximum coordinate range
    static initialize(minX, maxX, minZ, maxZ) {
        // Save the minimum values for offsetting later
        CoordinateLookup.minCoords = new Vector2(minX, minZ);
        // Calculate the size of the array that will be needed
        const range = new Vector2(maxX - minX, maxZ - minZ);
        // Preallocate the coordinate mapping array
        CoordinateLookup.coordinateMapping = new Array(range.z);
        for (let indexZ = 0; indexZ < range.z; indexZ++) {
            CoordinateLookup.coordinateMapping[indexZ] = new Array(range.x);
        }
    }
    // Make sure the coordinates are within the bounds of the range stored in the mapping table,
    // and return the indexes within the table.
    static coordinatesToIndices(coords) {
        // Make sure the coordinates are integers, and calculate the offset from the minimum
        const coordsInt = new Vector2(Math.floor(coords.x), Math.floor(coords.z));
        const indices = new Vector2(coordsInt.x - CoordinateLookup.minCoords.x, coordsInt.z - CoordinateLookup.minCoords.z);
        // Check if the coordinates are within the range stored in the mapping table
        if ((indices.x >= 0) && (indices.z >= 0)
            && (indices.z < CoordinateLookup.coordinateMapping.length)
            && (indices.x < CoordinateLookup.coordinateMapping[indices.z].length)) {
            // Everything's valid
            return indices;
        }
        // Not valid - print a debug message (using integer coordinates, not the real values)
        mc.world.sendMessage("Coordinates out of bounds! [" + coordsInt.x + "," + coordsInt.z + "]");
        indices.isValid = false;
        return indices;
    }
    // Store the mapping from coordinates -> roomNumber
    static saveCoordinateMapping(coords, roomNumber) {
        // Validate the coordinates and convert to table indices
        const indices = CoordinateLookup.coordinatesToIndices(coords);
        if (indices.isValid) {
            CoordinateLookup.coordinateMapping[indices.z][indices.x] = roomNumber;
        }
    }
    // Given the current coordinates, figure out which room number we're in.  Will return -1 if the
    // coordinates are not mapped.
    static getRoomNumber(coords) {
        // Validate the coordinates and convert to table indices
        const indices = CoordinateLookup.coordinatesToIndices(coords);
        if (indices.isValid) {
            return CoordinateLookup.coordinateMapping[indices.z][indices.x];
        }
        return -1;
    }
}

//# sourceMappingURL=../../_GameLoopSampleDebug/CoordLookup.js.map
