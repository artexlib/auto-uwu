module.exports = [
    {
        "key": "isEnabled",
        "name": "Enable module",
        "type": "bool"
    },
    {
        "key": "outputChannel",
        "name": "Output Channel",
        "type": "number",
        "min": 1.0,
        "max": 50.0,
        "step": 1.0
    },
    {
        "key": "autoMode",
        "name": "Auto Channel",
        "type": "bool"
    },
    {
        "key": "randomDelayMin",
        "name": "randomDelayMin",
        "type": "number",
        "min": 200.0,
        "max": 5000.0,
        "step": 100.0
    },
    {
        "key": "randomDelayMax",
        "name": "randomDelayMax",
        "type": "number",
        "min": 500.0,
        "max": 10000.0,
        "step": 100.0
    }
];
