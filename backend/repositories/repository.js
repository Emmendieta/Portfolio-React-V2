import { categoriesManger, citiesManager, continentsManager, countriesManager, educationMananger, peopleManager, permissionsManager, provincesManager, proyectsManager, responsibilitiesManager, rolesManager, skillsMananger, socialsManager, usersManager, worksManager, habilitiesManager } from "../dao/mongo/dao.mongo.js";
import CategoriesDTO from "../dto/categories.dto.js";
import CitiesDTO from "../dto/cities.dto.js";
import ContinentsDTO from "../dto/cotinents.dto.js";
import CountriesDTO from "../dto/countries.dto.js";
import EducationsDTO from "../dto/educations.dto.js";
import HabilitiesDTO from "../dto/habilities.dto.js";
import PeopleDTO from "../dto/people.dto.js";
import PermissionsDTO from "../dto/permissions.dto.js";
import ProvincesDTO from "../dto/provinces.dto.js";
import ProyectsDTO from "../dto/proyects.dto.js";
import ResponsibilitiesDTO from "../dto/responsibilities.dto.js";
import RolesDTO from "../dto/roles.dto.js";
import SKillsDTO from "../dto/skills.dto.js";
import SocialsDTO from "../dto/socials.dto.js";
import UsersDTO from "../dto/users.dto.js";
import WorksDTO from "../dto/works.dto.js";

class Repository {
    constructor(manager, dto) {
        this.manager = manager;
        this.dto = dto;
    };

    createOne = async (data, options = {}) => await this.manager.createOne(new this.dto(data), options);
    createMany = async (dataArray, options = {}) => {
        if (!Array.isArray(dataArray)) { throw new Error("create many expects an array!"); };
        const dtos = dataArray.map(item => new this.dto(item));
        return await this.manager.createMany(dtos, options);
    };
    readAll = async () => await this.manager.readAll();
    readById = async (id) => await this.manager.readById(id);
    readIfExistMany = async (field, values) => await this.manager.readIfExistMany(field, values);
    readByIdAndPopulate = async (id, populateFields) => await this.manager.readByIdAndPopulate(id, populateFields);
    readAllAndPopulate = async (populateFields = []) => await this.manager.readAllAndPopulate(populateFields);
    readAllAndPopulateFilters = async (populateFields = [], filters = {}) => await this.manager.readAllAndPopulateFilters(populateFields, filters);
    readOneByFilter = async (filter) => await this.manager.readOneByFilter(filter);
    readByFilter = async (filter) => await this.manager.readByFilter(filter);
    updateById = async (id, data, options = {}) => await this.manager.updateById(id, data, options);
    updateManyByFilter = async (filter, update, options) => await this.manager.updateManyByFilter(filter, update, options);
    updateOrder = async (orderedIds) => await this.manager.updateOrderDragDrop(orderedIds);
    readLastByOrder = async (orderedIds) => await this.manager.readLastByOrder();
    destroyById = async (id, options = {}) => await this.manager.destroyById(id, options);
    destroyManyByFilter = async (filter, options = {}) => await this.manager.destroyManyByFilter(filter, options);
    totalElements = async () => await this.manager.totalElements();
    reorderAfterDelete = async (session = null) => await this.manager.reorderAfterDelete(session);
    paginate = async (options) => await this.manager.paginate(options);
    paginateAggregate = async (options) => await this.manager.paginateAggregate(options);
};

const categoriesRepository = new Repository(categoriesManger, CategoriesDTO);
const citiesRepository = new Repository(citiesManager, CitiesDTO);
const continentsRepository = new Repository(continentsManager, ContinentsDTO);
const countriesRepository = new Repository(countriesManager, CountriesDTO);
const educationsRepository = new Repository(educationMananger, EducationsDTO);
const peopleRepository = new Repository(peopleManager, PeopleDTO);
const permissionsRepository = new Repository(permissionsManager, PermissionsDTO);
const provincesRepository = new Repository(provincesManager, ProvincesDTO);
const proyectsRepository = new Repository(proyectsManager, ProyectsDTO);
const rolesRepository = new Repository(rolesManager, RolesDTO);
const skillsRepository = new Repository(skillsMananger, SKillsDTO);
const socialsRepository = new Repository(socialsManager, SocialsDTO);
const usersRepository = new Repository(usersManager, UsersDTO);
const worksRepository = new Repository(worksManager, WorksDTO);
const habilitiesRepository = new Repository(habilitiesManager, HabilitiesDTO);
const responsibilitiesRepository = new Repository(responsibilitiesManager, ResponsibilitiesDTO);

export {
    categoriesRepository, citiesRepository, continentsRepository, countriesRepository, educationsRepository, peopleRepository,
    permissionsRepository, provincesRepository, proyectsRepository, rolesRepository, skillsRepository, socialsRepository, usersRepository,
    worksRepository, habilitiesRepository, responsibilitiesRepository
};