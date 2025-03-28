const express = require('express');
const cors = require('cors');
const app = express();
app.use(express.json());
app.use(cors());

const PORT = 5000;

function calcCost(w, d) {
    let c = 0;
    // For first 5 kg
    if (w > 0) {
        c +=  10 * d;
        w -= 5;
    }
    // if weight is more than 5 kg then for each 5 kg we will charge 8 * d
    while (w > 0) {
        c += 8 * d;
        w -= 5;
    }

    return c;
}

function calcTotal(items) {
    let total = 0;
    let visited = [];
    // starting will be from C1 because it has highest distance and our goal is to minimize the cost
    let c1W = (items["A"] || 0) * 3 + (items["B"] || 0) * 2 + (items["C"] || 0) * 8;
    if (c1W > 0) {
        total += calcCost(c1W, 3);
        visited.push("C1");
    }

    let c2W = (items["D"] || 0) * 12 + (items["E"] || 0) * 25 + (items["F"] || 0) * 15;
    if (c2W > 0) {
        total += calcCost(c2W, 2.5);
        visited.push("C2");
    }

    let c3W = (items["H"] || 0) * 1 + (items["I"] || 0) * 2 + (items["G"] || 0) * 0.5;
    if (c3W > 0) {
        total += calcCost(c3W, 2);
        visited.push("C3");
    }

    // Now we will calculate the cost incurred during the travel with no goads in the truck
    for (let i = 0; i < visited.length - 1; i++) {
        const next = visited[i + 1];
        let dist = next === "C1" ? 3 : next === "C2" ? 2.5 : 2;
        total += dist * 10;
    }

    return total;
}

app.post("/mincostcalc", (req, res) => {
    try {
        const items = req.body;
        const minCost  = calcTotal(items);
        res.json({
            totalMinimumCost: minCost,
        });
    } catch (err) {
        res.status(400).send({ error: "Something Went Wrong" });
    }
});

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});