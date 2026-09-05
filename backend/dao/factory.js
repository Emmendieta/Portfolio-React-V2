const { PERSISTENCE } = process.env;

let dao = {};

switch (PERSISTENCE) { 
    case "memory":
        console.log("Logica pendiente de memory");
        {
            const { categoriesManger, citiesManager, continentsManager, countriesManager, educationMananger, peopleManager, permissionsManager, provincesManager, proyectsManager, rolesManager, skillsMananger, socialsManager, usersManager, worksManager, habilitiesManager, responsibilitiesManager } = await import("./memory/dao.memory.js");
            dao = { categoriesManger, citiesManager, continentsManager, countriesManager, educationMananger, peopleManager, permissionsManager, provincesManager, proyectsManager, rolesManager, skillsMananger, socialsManager, usersManager, worksManager, habilitiesManager, responsibilitiesManager };
        };
        break;
    case "fs":
        console.log("Logica pendiente de fs");
        {
            const { categoriesManger, citiesManager, continentsManager, countriesManager, educationMananger, peopleManager, permissionsManager, provincesManager, proyectsManager, rolesManager, skillsMananger, socialsManager, usersManager, worksManager, habilitiesManager, responsibilitiesManager } = await import("./fs/dao.fs.js");
            dao = { categoriesManger, citiesManager, continentsManager, countriesManager, educationMananger, peopleManager, permissionsManager, provincesManager, proyectsManager, rolesManager, skillsMananger, socialsManager, usersManager, worksManager, habilitiesManager, responsibilitiesManager };
        };
        break;
    default:
        {
            const { categoriesManger, citiesManager, continentsManager, countriesManager, educationMananger, peopleManager, permissionsManager, provincesManager, proyectsManager, rolesManager, skillsMananger, socialsManager, usersManager, worksManager, habilitiesManager, responsibilitiesManager } = await import("./mongo/dao.mongo.js");
            dao = { categoriesManger, citiesManager, continentsManager, countriesManager, educationMananger, peopleManager, permissionsManager, provincesManager, proyectsManager, rolesManager, skillsMananger, socialsManager, usersManager, worksManager, habilitiesManager, responsibilitiesManager };
        };
        break;
};

const { categoriesManger, citiesManager, continentsManager, countriesManager, educationMananger, peopleManager, permissionsManager, provincesManager, proyectsManager, rolesManager, skillsMananger, socialsManager, usersManager, worksManager, habilitiesManager, responsibilitiesManager } = dao;
export { categoriesManger, citiesManager, continentsManager, countriesManager, educationMananger, peopleManager, permissionsManager, provincesManager, proyectsManager, rolesManager, skillsMananger, socialsManager, usersManager, worksManager, habilitiesManager, responsibilitiesManager };
export default dao;