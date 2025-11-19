export const formatearIngrediente = nombreIngrediente => {
    if (nombreIngrediente.startsWith("de ")) return `Medallón ${nombreIngrediente}`;
    return nombreIngrediente;
};