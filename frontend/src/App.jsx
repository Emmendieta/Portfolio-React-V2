import { useContext, useState } from 'react'
import { UserContext, UserProvider } from './context/User.Context'
import Layout from './Layout'
import Home from './components/home/home'
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import Login from './components/login/login'
import CitiesList from './components/body/cities/citiesList/citiesList'
import CitiesForm from './components/body/cities/citiesForm/citiesForm'
import ProvincesList from './components/body/provinces/provincesList/provincesList'
import ProvincesForm from './components/body/provinces/provincesForm/provincesForm'
import CountriesList from './components/body/countries/countriesList/countriesList'
import CountriesForm from './components/body/countries/countriesForm/countriesForm'
import ContinentsList from './components/body/continents/continentsList/continentsList'
import ContinentsForm from './components/body/continents/continentsForm/continentsForm'
import PermissionsList from './components/body/permissions/permissionsList/permissionsList'
import PermissionsForm from './components/body/permissions/permissionsForm/permissionsForm'
import RoleList from './components/body/roles/rolesList/rolesList'
import RoleForm from './components/body/roles/rolesForm/rolesForm'
import PeopleList from './components/body/people/peopleList/peopleList'
import PeopleForm from './components/body/people/peopleForm/peopleForm'
import UsersList from './components/body/users/usersList/usersList'
import UsersForm from './components/body/users/usersForm/usersForm'
import HabilitiesList from './components/body/habilities/habilitiesList/habilitiesList'
import HabilitiesForm from './components/body/habilities/habilitiesForm/habilitiesForm'
import ResponsibilitiesList from './components/body/responsibilities/responsibilitiesList/responsibilitiesList'
import ResponsibilitiesForm from './components/body/responsibilities/responsibilitiesForm/responsibilitiesForm'
import CategoriesList from './components/body/categories/categoriesList/categoriesList'
import CategoriesForm from './components/body/categories/categoriesForm/categoriesForm'
import EduactionsList from './components/body/educations/educationsList/educationsList'
import EducationsForm from './components/body/educations/educationsForm/educationsForm'
import WorksList from './components/body/works/worksList/worksList'
import WorksForm from './components/body/works/worksForm/worksForm'
import SkillsList from './components/body/skills/skillsList/skillsList'
import SkillsForm from './components/body/skills/skillsForm/skillsForm'
import ProyectsList from './components/body/proyects/proyectsList/proyectsList'
import ProyectsForm from './components/body/proyects/proyectsForm/proyectsForm'
import SocialsList from './components/body/socials/socialsList/socialsList'
import SocialsForm from './components/body/socials/socialsForm/socialsForm'
import { RefreshProvider } from './context/Refresh.Context'
import Forbidden from './components/forbidden/forbidden'
import NotFound from './components/notFound/notFound'
import ProtectedRoutes from './routes/ProtectedRoutes'
import CategoriesCreateManyForm from './components/body/categories/categoriesManyForm/categoriesManyForm'
import CategoriesOrder from './components/body/categories/categoriesOrder/categoriesOrder'
import EducationsOrder from './components/body/educations/educationsOrder/educationsOrder'
import ProyectsOrder from './components/body/proyects/proyectsOrder/proyectsOrder'
import SkillsOrder from './components/body/skills/skillsOrder/skillsOrder'
import SocialOrder from './components/body/socials/socialsOrder/socialsOrder'
import WorksOrder from './components/body/works/worksOrder/worksOrder'

function AppRoutes() {
  const { loadingUser } = useContext(UserContext);
  if (loadingUser) { return <div>"Loading USER (DESPUES CAMBIAR)"</div> };

  return (
    <Routes>
      <Route path="/" element={<Layout />} >
        <Route index element={<Home />} />
        <Route path="/login" element={<Login />} />

        <Route path='/people' element={
          <ProtectedRoutes permissionResolver={() => "read_all_people"} >
            <PeopleList />
          </ProtectedRoutes>
        } />
        <Route path='/people/form/:id' element={<PeopleForm />} />

        <Route path='/users' element={
          /*  <ProtectedRoutes permissionResolver={() => "read_all_users"} > */
          <UsersList />
          /* </ProtectedRoutes> */
        } />
        <Route path="/users/form/:id" element={
          /* <ProtectedRoutes permissionResolver={({ id }) => id === "new" ? "create_users": "update_users" }> */
          <UsersForm />
          /* </ProtectedRoutes> */
        } />

        <Route path='/cities' element={
          <ProtectedRoutes permissionResolver={() => "read_all_cities"}>
            <CitiesList />
          </ProtectedRoutes>
        } />
        <Route path='/cities/form/:id' element={
          <ProtectedRoutes permissionResolver={({ id }) => id === "new" ? "create_cities" : "update_cities"}>
            <CitiesForm />
          </ProtectedRoutes>
        } />

        <Route path="/provinces" element={
          <ProtectedRoutes permissionResolver={() => "read_all_provinces"}>
            <ProvincesList />
          </ProtectedRoutes>
        } />
        <Route path="/provinces/form/:id" element={
          <ProtectedRoutes permissionResolver={({ id }) => id === "new" ? "create_provinces" : "update_provinces"}>
            <ProvincesForm />
          </ProtectedRoutes>
        } />

        <Route path="/countries" element={
          <ProtectedRoutes permissionResolver={() => "read_all_countries"}>
            <CountriesList />
          </ProtectedRoutes>
        } />
        <Route path="/countries/form/:id" element={
          <ProtectedRoutes permissionResolver={({ id }) => id === "new" ? "create_countries" : "update_countries"} >
            <CountriesForm />
          </ProtectedRoutes>
        } />

        <Route path="/continents" element={
          <ProtectedRoutes permissionResolver={() => "read_all_continents"}>
            <ContinentsList />
          </ProtectedRoutes>
        } />
        <Route path="/continents/form/:id" element={
          <ProtectedRoutes permissionResolver={({ id }) => id === "new" ? "create_continents" : "update_continents"}>
            <ContinentsForm />
          </ProtectedRoutes>
        } />

        <Route path="/permissions" element={
          <ProtectedRoutes permissionResolver={() => "read_all_permissions"}>
            <PermissionsList />
          </ProtectedRoutes>
        } />
        <Route path="/permissions/form/:id" element={
          /*<ProtectedRoutes permissionResolver={({ id }) => id === "new" ? "create_permissions" : "update_permissions"}>*/
            <PermissionsForm />
          /*</ProtectedRoutes>*/}
        />

        <Route path="/roles" element={
          <ProtectedRoutes permissionResolver={() => "read_all_roles"}>
            <RoleList />
          </ProtectedRoutes>
        } />
        <Route path="/roles/form/:id" element={
          <ProtectedRoutes permissionResolver={({ id }) => id === "new" ? "create_roles" : "update_roles"}>
            <RoleForm />
          </ProtectedRoutes>
        } />

        <Route path='/habilities' element={
          <ProtectedRoutes permissionResolver={() => "read_all_habilities"}>
            <HabilitiesList />
          </ProtectedRoutes>
        } />
        <Route path='/habilities/form/:id' element={
          <ProtectedRoutes permissionResolver={({ id }) => id === "new" ? "create_habilities" : "update_habilities"} >
            <HabilitiesForm />
          </ProtectedRoutes>
        } />

        <Route path='/responsibilities' element={
          <ProtectedRoutes permissionResolver={() => "read_all_responsibilities"}>
            <ResponsibilitiesList />
          </ProtectedRoutes>
        } />
        <Route path='/responsibilities/form/:id' element={
          <ProtectedRoutes permissionResolver={({ id }) => id === "new" ? "create_responsibilities" : "update_responsibilities"}>
            <ResponsibilitiesForm />
          </ProtectedRoutes>
        } />

        <Route path='/categories' element={
          <ProtectedRoutes permissionResolver={() => "read_all_categories"}>
            <CategoriesList />
          </ProtectedRoutes>
        } />
        <Route path='/categories/form/:id' element={
          <ProtectedRoutes permissionResolver={({ id }) => id === "new" ? "create_categories" : "update_categories"}>
            <CategoriesForm />
          </ProtectedRoutes>
        } />
        <Route path='/categories/many/form' element={<CategoriesCreateManyForm />} />
        <Route path='/categories/reorder' element={<CategoriesOrder /> } />

        <Route path='/educations' element={
          <ProtectedRoutes permissionResolver={() => "read_all_educations"}>
            <EduactionsList />
          </ProtectedRoutes>
        } />
        <Route path='/educations/form/:id' element={
          <ProtectedRoutes permissionResolver={({ id }) => id === "new" ? "create_educations" : "create_educations"}>
            <EducationsForm />
          </ProtectedRoutes>
        } />
        <Route path='/educations/reorder' element={<EducationsOrder /> } />

        <Route path='/proyects' element={
          <ProtectedRoutes permissionResolver={() => "read_all_proyects"}>
            <ProyectsList />
          </ProtectedRoutes>
        } />
        <Route path='/proyects/form/:id' element={
          <ProtectedRoutes permissionResolver={({ id }) => id === "new" ? "create_proyects" : "update_proyects"}>
            <ProyectsForm />
          </ProtectedRoutes>
        } />
        <Route path='proyects/reorder' element={ <ProyectsOrder /> } />

        <Route path='/skills' element={
          <ProtectedRoutes permissionResolver={() => "read_all_skills"}>
            <SkillsList />
          </ProtectedRoutes>
        } />
        <Route path='/skills/form/:id' element={
          <ProtectedRoutes permissionResolver={({ id }) => id === "new" ? "create_skills" : "update_skills"} >
            <SkillsForm />
          </ProtectedRoutes>
        } />
        <Route path='/skills/reorder' element={<SkillsOrder /> } />


        <Route path='/socials' element={
          <ProtectedRoutes permissionResolver={() => "read_all_socials"}>
            <SocialsList />
          </ProtectedRoutes>
        } />
        <Route path='/socials/form/:id' element={
          <ProtectedRoutes permissionResolver={({ id }) => id === "new" ? "create_socials" : "update_socials"}>
            <SocialsForm />
          </ProtectedRoutes>
        } />
        <Route path='/socials/reorder' element={<SocialOrder /> } />

        <Route path='/works' element={
          <ProtectedRoutes permissionResolver={() => "read_all_works"}>
            <WorksList />
          </ProtectedRoutes>
        } />
        <Route path='/works/form/:id' element={
          <ProtectedRoutes permissionResolver={({ id }) => id === "new" ? "create_works" : "update_works"}>
            <WorksForm />
          </ProtectedRoutes>
        } />
        <Route path='/works/reorder' element={<WorksOrder /> } />

        <Route path='/forbidden' element={<Forbidden />} />
        <Route path='*' element={<NotFound />} />

      </Route>
    </Routes>
  );
};

function App() {
  return (
    <UserProvider>
      <BrowserRouter>
        <RefreshProvider>
          <AppRoutes />
        </RefreshProvider>
      </BrowserRouter>
    </UserProvider>
  );
};

export default App;
