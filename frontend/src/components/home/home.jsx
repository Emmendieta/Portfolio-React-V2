import { useState } from "react";
import CategoriesList from "../body/categories/categoriesList/categoriesList";
import EduactionsList from "../body/educations/educationsList/educationsList";
import PeoplePresentation from "../body/people/peoplePresentation/peoplePresentation";
import ProyectsList from "../body/proyects/proyectsList/proyectsList";
import SkillsList from "../body/skills/skillsList/skillsList";
import WorksList from "../body/works/worksList/worksList";

function Home() {

    const [selectedCategory, setSelectedCategory] = useState(null);
    return (
        <>
            <section id="person">
                <PeoplePresentation />
            </section>
            <section id="works" >
                <WorksList />
            </section>
            <section id="educations" >
                <EduactionsList />
            </section>
            <section id="skills" >
                <SkillsList />
            </section>
            <section id="categories" >
                <CategoriesList selectedCategory={selectedCategory} onCategorySelect={setSelectedCategory}/>
            </section>
            <section id="proyects" >
                <ProyectsList selectedCategory={selectedCategory}/>
            </section>
        </>
    );
};

export default Home;