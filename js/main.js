//ROAD
function Road(km, tunnels, gasStations, vehicles, limits) { //functia constructor incepe cu litera mare
    this.km = km;
    this.tunnels = tunnels;
    this.gasStations = gasStations;
    this.vehicles = vehicles;
    this.passedTunnels = 0;
    this.passedGasStations = 0;
    this.passedLimits = 0;
    this.limits = limits;
    this.timer = setInterval(timerForRoad.bind(this), 1000); //pe setInterval se pierde contextul si nu mai stim cine este 'this' si trebuie sa folosim bind
    this.alert = setTimeout(alertForEvent.bind(this, "tunnel"), (Math.random() * 2000) + 3000);
    this.alert = setTimeout(alertForEvent.bind(this, "gas station"), (Math.random() * 2000) + 7000);
    this.alert = setTimeout(alertForEvent.bind(this, "speed limit"), (Math.random() * 2000) + 5000);

    var tableRoad = document.getElementById("tableRoad");
    var newRow = document.createElement("tr");
    var tdKm = document.createElement("td");
    tdKm.innerHTML = this.km;
    var tdTunnels = document.createElement("td");
    tdTunnels.innerHTML = this.tunnels.length;
    var tdGas = document.createElement("td");
    tdGas.innerHTML = this.gasStations.length;
    var tdVehicles = document.createElement("td");
    tdVehicles.innerHTML = this.vehicles.length;
    newRow.appendChild(tdKm);
    newRow.appendChild(tdTunnels);
    newRow.appendChild(tdGas);
    newRow.appendChild(tdVehicles);
    tableRoad.appendChild(newRow);
}

function timerForRoad() {
    for (var i = 0; i < this.vehicles.length; i++) {
        this.vehicles[i].timePassed();
    }
}

function alertForEvent(ev) {
    if (ev === "tunnel" && this.tunnels.length > this.passedTunnels) {
        for (var i = 0; i < this.vehicles.length; i++) {
            this.vehicles[i].pay(this.tunnels[this.passedTunnels]);
            this.vehicles[i].turnLightsOn(this.tunnels[this.passedTunnels]);
        }
        this.passedTunnels ++;
        console.log("Tunnel");
        this.alert = setTimeout(alertForEvent.bind(this, ev), (Math.random() * 2000) + 3000);
    }
    if (ev === "gas station" && this.gasStations.length > this.passedGasStations) {
        for (var i = 0; i < this.vehicles.length; i++) {
            this.vehicles[i].addGas(this.gasStations[this.passedGasStations]);
        }
        this.passedGasStations ++;
        console.log("Gas Station");
        this.alert = setTimeout(alertForEvent.bind(this, ev), (Math.random() * 2000) + 3000);
    }
    if (ev === "speed limit" && this.limits.length > this.passedLimits) {
        console.log("speed limit" + " " + this.limits[this.passedLimits].getSpeedLimit());
        for (var i = 0; i < limits.length; i++) {
            this.vehicles[i].alertSpeedLimit(this.limits[this.passedLimits]);
        }
        this.passedLimits ++;
        this.alert = setTimeout(alertForEvent.bind(this, ev), (Math.random() * 2000) + 3000);
    }
}

Road.prototype.addVehicle = function (vehicle) {
    this.vehicles.push(vehicle);
    var tableRoad = document.getElementById("tableRoad");
    tableRoad.lastChild.lastChild.innerHTML = this.vehicles.length;

    return this.vehicles.length;
}

//VEHICLES
function Vehicle(maxSpeed, tank, lps, kmps) {
    this.maxSpeed = maxSpeed;
    this.tank = tank;
    this.lps = lps;
    this.kmps = kmps;
    this.currentSpeed = 0;
    this.totalConsume = 0;
    this.drove = 0;
    this.paid = 0;
    this.consume = 0;
    this.position = 0;
    this.LightsOn = false;

    if (maxSpeed === undefined) {
        return;
    }

    var tableVehicles = document.getElementById("tableVehicles");
    var newRow = document.createElement("tr");
    var tdLights = document.createElement("td");
    var lights = document.createElement("div");
    lights.classList.add("lights-gray");
    tdLights.appendChild(lights);
    var tdType = document.createElement("td");
    if (this instanceof Car) {
        tdType.innerHTML = "car";
    }
    if (this instanceof Moto) {
        tdType.innerHTML = "moto";
    }
    if (this instanceof Truck) {
        tdType.innerHTML = "truck";
    }
    var tdConsume = document.createElement("td");
    tdConsume.innerHTML = this.consume;
    var tdTotalConsume = document.createElement("td");
    tdTotalConsume.innerHTML = this.totalConsume;
    var tdDrove = document.createElement("td");
    tdDrove.innerHTML = this.drove;
    var tdPaid = document.createElement("td");
    tdPaid.innerHTML = this.paid;
    var tdCurrentSpeed = document.createElement("td");
    tdCurrentSpeed.innerHTML = this.currentSpeed;
    newRow.appendChild(tdLights);
    newRow.appendChild(tdType);
    newRow.appendChild(tdConsume);
    newRow.appendChild(tdTotalConsume);
    newRow.appendChild(tdDrove);
    newRow.appendChild(tdPaid);
    newRow.appendChild(tdCurrentSpeed);
    tableVehicles.appendChild(newRow);
}

Vehicle.prototype.drive = function (road) {
    var vehiclePosition = road.addVehicle(this);
    this.position = vehiclePosition;
    this.reachSpeed(30, 200);
}

Vehicle.prototype.reachSpeed = function(acc, max) { // max este viteza pe care vrem sa o atingem
    var steps = Math.floor(max/acc); // 'steps' - in cati pasi putem atinge max
    for (i = 0; i < steps; i++) {
        setTimeout(this.accelerate.bind(this, acc), (3000 * (i + 1))); // acc - valoarea cu care accelereaza; 3000 - este intervalul
    }
}

Vehicle.prototype.timePassed = function() {
    this.totalConsume += this.lps;
    this.consume += this.lps;
    this.drove += this.kmps;

    var tableVehicles = document.getElementById("tableVehicles");
    var rowPosition = tableVehicles.children[this.position];
    var colConsume = rowPosition.children[2];
    var colTotalConsume = rowPosition.children[3];
    var colDrove = rowPosition.children[4];
    colConsume.innerHTML = (this.consume).toFixed(2);
    colTotalConsume.innerHTML = (this.totalConsume).toFixed(2);
    colDrove.innerHTML = (this.drove).toFixed(2);
}

Vehicle.prototype.pay = function(tunnel) {
    var tunnelToll = tunnel.calculateToll(this);
    this.paid += tunnelToll;

    this.break(200);
    this.reachSpeed(10, 180);

    var tableVehicles = document.getElementById("tableVehicles");
    var rowPosition = tableVehicles.children[this.position];
    var colTotalPaid = rowPosition.children[5];
    colTotalPaid.innerHTML = (this.paid).toFixed(2);
}

Vehicle.prototype.turnLightsOff = function() {
    this.LightsOn = false;
    var tableVehicles = document.getElementById("tableVehicles");
    var rowPosition = tableVehicles.children[this.position];
    rowPosition.children[0].children[0].classList.remove("lights-yellow");
}

Vehicle.prototype.turnLightsOn = function(tunnel) {
    this.LightsOn = true;
    var duration = (tunnel.km/this.kmps) * 1000;
    setTimeout(this.turnLightsOff.bind(this), duration);
    var tableVehicles = document.getElementById("tableVehicles");
    var rowPosition = tableVehicles.children[this.position];
    rowPosition.children[0].children[0].classList.add("lights-yellow");
}

Vehicle.prototype.addGas = function(gasStation) {
    this.paid += this.consume * gasStation.getGasPrice();
    this.consume = 0;

    this.break(200);
    this.reachSpeed(10, 180);

    var tableVehicles = document.getElementById("tableVehicles");
    var rowPosition = tableVehicles.children[this.position];
    var colConsume = rowPosition.children[2];
    var colTotalPaid = rowPosition.children[5];
    colConsume.innerHTML = (this.consume).toFixed(2);
    colTotalPaid.innerHTML = (this.paid).toFixed(2);
}
Vehicle.prototype.accelerate = function(value) {
    this.currentSpeed += value;
    if (this.currentSpeed > this.maxSpeed) {
        this.currentSpeed = this.maxSpeed;
    }

    var tableVehicles = document.getElementById("tableVehicles");
    var rowPosition = tableVehicles.children[this.position];
    rowPosition.children[6].innerHTML = this.currentSpeed;
}

Vehicle.prototype.break = function(value) {
    this.currentSpeed -= value;
    if (this.currentSpeed < 0) {
        this.currentSpeed = 0;
    }
    
    var tableVehicles = document.getElementById("tableVehicles");
    var rowPosition = tableVehicles.children[this.position];
    rowPosition.children[6].innerHTML = this.currentSpeed;
}

Vehicle.prototype.payFine = function(value) {
    this.paid += value;
    var tableVehicles = document.getElementById("tableVehicles");
    var rowPosition = tableVehicles.children[this.position];
    var colTotalPaid = rowPosition.children[5];
    colTotalPaid.innerHTML = this.paid;
}

Vehicle.prototype.alertSpeedLimit = function(speedLimit) {
    var rndmNumber = Math.random();
    if (rndmNumber < 0.5) {
        if (this.currentSpeed > speedLimit.getSpeedLimit()) {
            this.break(this.currentSpeed - speedLimit.getSpeedLimit());
        }
    }
}

function Car() {
    Vehicle.call(this, 280, 50, 0.5, 2); // 'call' apeleleaza functia constructor
}
Car.prototype = new Vehicle;

function Moto() {
    Vehicle.call(this, 360, 30, 0.3, 10);
}
Moto.prototype = new Vehicle;

function Truck() {
    Vehicle.call(this, 260, 80, 0.9, 1);
}
Truck.prototype = new Vehicle;

//GAS STATION
function GasStation(pricePerLiter) {
    this.pricePerLiter = pricePerLiter;

    var tableGas = document.getElementById("tableGas");
    var newRow = document.createElement("tr");
    tdPrice = document.createElement("td");
    tdPrice.innerHTML = this.pricePerLiter;
    newRow.appendChild(tdPrice);
    tableGas.appendChild(newRow);
}

GasStation.prototype.getGasPrice = function() {
    return this.pricePerLiter;
}

//TUNNEL
function Tunnel(km, pricePerKm, pricePerType) {
    this.km = km;
    this.pricePerKm = pricePerKm;
    this.pricePerType = pricePerType;

    var tableTunnels = document.getElementById("tableTunnels");
    var newRow = document.createElement("tr");
    var tdKm = document.createElement("td");
    tdKm.innerHTML = this.km;
    var tdPricePerKm = document.createElement("td");
    tdPricePerKm.innerHTML = this.pricePerKm;
    var tdPricePerType = document.createElement("td");
    tdPricePerType.innerHTML = JSON.stringify(this.pricePerType); //converts a JS object or value to a JSON string
    newRow.appendChild(tdKm);
    newRow.appendChild(tdPricePerKm);
    newRow.appendChild(tdPricePerType);
    tableTunnels.appendChild(newRow);
}

Tunnel.prototype.calculateToll = function(vehicle) {
    var toll = this.km * this.pricePerKm;
    if (vehicle instanceof Car) {
        toll += this.km * this.pricePerType.car;
    } else if (vehicle instanceof Moto) {
        toll += this.km * this.pricePerType.moto;
    } else if (vehicle instanceof Truck) {
        toll += this.km * this.pricePerType.truck;
    } else {
        toll = 9999;
    }
    return toll;
}

//SPEED LIMIT
function SpeedLimit(maxSpeed) {
    this.maxSpeed = maxSpeed;
}

SpeedLimit.prototype.getSpeedLimit = function() {
    return this.maxSpeed;
}

//END SPEED LIMIT

var pricePerType = {
    car: 0.3,
    moto: 0.7,
    truck: 0.5
}

var tunnels = [];
tunnels.push(new Tunnel(2, 0.7, pricePerType));
tunnels.push(new Tunnel(1.5, 0.7, pricePerType));
tunnels.push(new Tunnel(2.2, 0.7, pricePerType));
tunnels.push(new Tunnel(0.9, 0.7, pricePerType));

var limits = [];
limits.push(new SpeedLimit(130));
limits.push(new SpeedLimit(100));
limits.push(new SpeedLimit(80));
limits.push(new SpeedLimit(60));

var gasStations = [];
gasStations.push(new GasStation(1));
gasStations.push(new GasStation(1.1));
gasStations.push(new GasStation(1.4));

var firstCar = new Car();
var secondCar = new Car();
var moto = new Moto();
var truck = new Truck();
var road = new Road(240, tunnels, gasStations, [], limits);

firstCar.drive(road);
secondCar.drive(road);
moto.drive(road);
truck.drive(road);