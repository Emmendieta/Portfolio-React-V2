import { useContext, useEffect, useState } from "react";
import { UserContext } from "../../../../context/UserContext";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import { useLoading } from "../../../../context/LoadingContext";
import { useLanguage } from "../../../../context/LanguageContext";
import { LANG_CONST } from "../../../../constants/selectConstLang";
import H1Fields from "../../GeneralFields/H1Fields/H1Fields";
import H2Fields from "../../GeneralFields/H2Fields/H2Fields";
import { FaRegTrashCan } from "react-icons/fa6";
import { useConfirmSweet } from "../../../../context/SweetAlert2Context";
import { fetchContinentByIdPopulate, fetchDeleteContinentById } from "../ContinentsLogic";
import "../../GeneralFields/GeneralDetails.css";
import { TbWorldCog } from "react-icons/tb";
import Ul from "../../GeneralFields/Ul/Ul";
import { RiArrowGoBackFill } from "react-icons/ri";

function ContinentDetail() {
    const { user } = useContext(UserContext);
    const { state } = useLocation();
    const { id } = useParams();
    const [loading, setLoading] = useState(true);
    const [continent, setContinent] = useState(null);
    const { startLoading, stopLoading } = useLoading();
    const { errorSweet, successSweet, confirmSweet } = useConfirmSweet();
    const { language } = useLanguage();
    const TEXT = LANG_CONST[language];
    const navigate = useNavigate();

    useEffect(() => {
        const loadContinent = async () => {
            try {
                //FALTA VALIDAR AL USUARIO
                startLoading();
                if (state?.continent) {
                    await new Promise(resolve => setTimeout(resolve, 600));
                    const result = await fetchContinentByIdPopulate(state.continent._id);
                    if(result?.error) {
                        await errorSweet(result?.error.message || TEXT.TEXT_ERROR_OOPS);;
                        return;
                    };
                    const data = result.response || [];
                    setContinent(data);
                    return;
                } else {
                    if(id !== "new") {
                        const result = await fetchContinentByIdPopulate(id);
                        if(result?.error) {
                            await errorSweet(result?.error.message || TEXT.TEXT_ERROR_OOPS);
                            return;
                        };
                        const data = result.response || [];
                        setContinent(data);
                    };
                }
            } catch (error) {
                await errorSweet(error.message);
                    console.error("Error: ", error.message);
            } finally {
                setLoading(false);
                stopLoading();
            }
        };
        loadContinent();
    }, [id, state, user, language]);

    const handleDelete = async () => {
        try {
            const confirmDelete = await confirmSweet({
                title: TEXT.ARE_YOU_SURE,
                text: TEXT.DELETE_CONTINENT,
                confirmButtonText: TEXT.YES,
                cancelButtonText: TEXT.NO
            });
            if(!confirmDelete) return;
            const result = await fetchDeleteContinentById(continent._id);
            if(result?.error) throw new Error(result.error.message || TEXT.TEXT_ERROR_OOPS);
            await successSweet(`${TEXT.CONTINENT} ${TEXT.DELETED}`);
            navigate("/continents");
        } catch (error) {
            await errorSweet(error.message);
            console.error("Error: ", error.message);
        }
    };

    if (!continent) return <p>No Continent data Available!</p>

    return (
        <div className="generalDetailContainer">
            <section className="generalDetailTitle">
                <H1Fields label={`${TEXT.CONTINENT_DETAIL}:`} language={language} />
            </section>
            <section className="generalDetailInfo">
                <H2Fields label={TEXT.ID} value={continent._id} className={"h2GeneralDetails"} classNameH2={"h2GeneralDetailsH2"} classNameLabel={"h2GeneralDetailsLabel"} language={language} />
                <H2Fields label={`${TEXT.NAME} ${TEXT.OF} ${TEXT.CONTINENT}`} value={continent.name?.[language] || ""} className={"h2GeneralDetails"} classNameH2={"h2GeneralDetailsH2"} classNameLabel={"h2GeneralDetailsLabel"} language={language} />
            </section>
            <section className="generaDatailListContainter">
                    {continent.countries?.length > 0 ? (
                        <Ul list={continent.countries} classNameUl={"listGeneralDetailsUl"} classnameli={"listGeneralDetailsLi"} valueH1Field={`${TEXT.COUNTRY_LIST}:`} idH1Field={"listGeneralDetailsH1"} language={language} renderItem={(country) => (
                            <>
                                <H2Fields label={`${TEXT.COUNTRY}`} value={country.name?.[language] || ""} className={"listGeneralDetailsH2Container"} classNameLabel={"listGeneralDetailsH2Label"} classNameH2={"listGeneralDetailsH2Value"} language={language} />
                                {country.provinces?.length > 0 ? (
                                    <Ul list={country.provinces} classNameUl={"subListGeneralDetailsUl"} classnameli={"subListGeneralDetailsLi"} valueH1Field={`${TEXT.PROVINCE_LIST}:`} idH1Field={"subListGeneralDetailsH1"} language={language} renderItem={(province) => (
                                        <>
                                            <H2Fields label={`${TEXT.PROVINCE}`} value={province.name?.[language] || ""} className={"subListGeneralDetailsH2Container"} classNameLabel={"subListGeneralDetailsH2Label"} classNameH2={"subListGeneralDetailsH2Value"} language={language} />
                                        </>
                                    )} />
                                ): ( <p>{TEXT.NO} {TEXT.PROVINCES_ASSOCIATED}CORREGIR ESTILOS</p> )}
                            </>
                        )} />
                    ) : ( <p>{TEXT.NO} {TEXT.COUNTRIES_ASSOCIATED}CORREGIR ESTILOS</p> )}
            </section>
            <section className="generalDetailBtns">
                <button className="btn btn-outline-dark" id="generalDetailBtnBack" onClick={() => navigate("/continents")}><RiArrowGoBackFill className="iconBtnDetailsBack"/></button>
                <button className="btn btn-outline-primary" id="generalDetailBtnEdit" onClick={() => navigate(`/continents/form/${continent._id}`, { state: { continent } })}><TbWorldCog className="iconBtnDetailsEdit" /></button>
                <button className="btn btn-outline-danger" id="generalDetailBtnDelete" onClick={handleDelete}><FaRegTrashCan className="iconBtnDetailsDelete" /></button>
            </section>
        </div>
    )
};

export default ContinentDetail;