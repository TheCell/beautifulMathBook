class TravelingSalesmanSolver {
    points = [];
    distanceArray = [];
    bestPath = [];
    bestDistance = Infinity;

    constructor(points) {
        this.points = points;
        this.bestPath = [];
        this.bestDistance = Infinity;
        this._fillDistanceArray();
    }

    getPoints() {
        return this.points;
    }

    _fillDistanceArray() {
        this.distanceArray = [];
        // das ist doch falsch weil immer von jedem aktuellen Punkt zu jedem anderen Punkt gerechnet werden muss.
        for (let i = 0, j = 1; j < this.points.length; i++, j++) {
            this.distanceArray[i] = [];
            for (let k = 0; k < this.points.length; k++) {
                if (k === i) {
                    this.distanceArray[i][k] = 0;
                } else {
                    this.distanceArray[i][k] = this._calculateDistance(this.points[i], this.points[k]);
                }
            }
        }

        console.log(this.distanceArray);
    }

    _calculateDistance(pointA, pointB) {
        return Math.pow(pointB.x - pointA.x, 2) + Math.pow(pointB.y - pointA.y, 2);
    }
}