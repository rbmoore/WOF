var WheelSpinner = (function () {
    var wheel = document.getElementById('wheel'),
        wheelValues = [5000, 600, 500, 300, 500, 800, 550, 400, 300, 900, 500, 300, 900, 0, 600, 400, 300, -2, 800, 350, 450, 700, 300, 600],
        spinTimeout = false,
        spinModifier = function () {
            return Math.random() * 10 + 20;
        },
        modifier = spinModifier(),
        slowdownSpeed = 1,
        prefix = (function () {
            if (document.body.style.MozTransform !== undefined) {
                return "MozTransform";
            } else if (document.body.style.WebkitTransform !== undefined) {
                return "WebkitTransform";
            } else if (document.body.style.OTransform !== undefined) {
                return "OTransform";
            } else {
                return "";
            }
        }()),
        degreeToRadian = function (deg) {
            return deg / (Math.PI * 180);
        };

    function Wheel() {}

    Wheel.prototype.rotate = function (degrees) {
        var val = "rotate(-" + degrees + "deg)";
        if (wheel.style[prefix] !== undefined) wheel.style[prefix] = val;
        var rad = degreeToRadian(degrees % 360),
            filter = "progid:DXImageTransform.Microsoft.Matrix(sizingMethod='auto expand', M11=" + rad + ", M12=-" + rad + ", M21=" + rad + ", M22=" + rad + ")";
        if (wheel.style.filter !== undefined) wheel.style.filter = filter;
        wheel.setAttribute("data-rotation", degrees);
    };
    
    Wheel.prototype.addEventListener = function(eventName, eventHandler) {
        wheel.addEventListener(eventName, eventHandler, false);
    }

    Wheel.prototype.spin = function (callback, amount) {
        var _this = this;
        clearTimeout(spinTimeout);
        modifier -= slowdownSpeed;
        if (amount === undefined) {
            amount = parseInt(wheel.getAttribute('data-rotation'), 10);
        }
        this.rotate(amount);
        if (modifier > 0) {
            spinTimeout = setTimeout(function () {
                _this.spin(callback, amount + modifier);
            }, 1000 / 5);
        } else {
            var dataRotation = parseInt(wheel.getAttribute('data-rotation'), 10);
            modifier = spinModifier();
            var divider = 360 / wheelValues.length;
            var offset = divider / 2; //half division
            var wheelValue = wheelValues[Math.floor(Math.ceil((dataRotation + offset) % 360) / divider)];
            switch (wheelValue) {
                case 0:
                    return callback('BANKRUPT');
                case -1:
                    return callback("Free Spin");
                case -2:
                    return callback("LAT");
                default:
                    return callback(wheelValue);
            }
        }
    };

    return Wheel;
})();

window.Wheel = new WheelSpinner();
