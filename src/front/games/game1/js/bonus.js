function applyBonus(point) {
    let bonus = 0;
    if (point % 100 === 0) {
        bonus = 100;
    }
    
    if (point % 1000 === 0) {
        bonus = 500;
    }
    return bonus;
}

export { applyBonus };