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
import { fetchCountryByIdPopulate, fetchDeleteCountryById } from "../CountriesLogic";
import { TbWorldCog } from "react-icons/tb";
import { RiArrowGoBackFill } from "react-icons/ri";
import Ul from "../../GeneralFields/Ul/Ul";
import "../../GeneralFields/GeneralDetails.css";

function CountryDetail() {
    const { user } = useContext(UserContext);
    const { state } = useLocation();
    const { id } = useParams();
    const [loading, setLoading] = useState(true);
    const [country, setCountry] = useState(null);
    const { startLoading, stopLoading } = useLoading();
    const { language } = useLanguage();
    const TEXT = LANG_CONST[language];
    const { errorSweet, successSweet, confirmSweet } = useConfirmSweet();
    const navigate = useNavigate();

    useEffect(() => {
        const loadCountry = async () => {
            try {
                //FALTA VALIDAR AL USUARIO
                startLoading();
                if (state?.country) {
                    await new Promise(resolve => setTimeout(resolve, 600));
                    setCountry(state.country);
                    return;
                } else {
                    if (id !== "new") {
                        const result = await fetchCountryByIdPopulate(id);
                        if (result?.error) {
                            await errorSweet(result?.error.message || TEXT.TEXT_ERROR_OOPS);
                            return;
                        };
                        const data = result.response || [];
                        setCountry(data);
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
        loadCountry();
    }, [id, state, user, language]);

    const handleDelete = async () => {
        try {
            const confirmDelete = await confirmSweet({
                title: TEXT.ARE_YOU_SURE,
                text: TEXT.DELETE_COUNTRY,
                confirmButtonText: TEXT.YES,
                cancelButtonText: TEXT.NO
            });
            if (!confirmDelete) return;
            const result = await fetchDeleteCountryById(country._id);
            if (result?.error) throw new Error(result.error.message || TEXT.TEXT_ERROR_OOPS);
            await successSweet(`${TEXT.COUNTRY} ${TEXT.DELETED}`);
            navigate("/countries");
        } catch (error) {
            await errorSweet(error.message);
            console.error("Error: ", error.message);
        }
    };

    if (!country) return <p>No Country data Available!</p>

    return (
        <div className="generalDetailContainer">
            <section className="generalDetailTitle">
                <H1Fields label={`${TEXT.COUNTRY_DETAIL}:`} language={language} />
            </section>
            <section className="generalDetailInfo">
                <H2Fields label={TEXT.ID} value={country._id} className={"h2GeneralDetails"} classNameH2={"h2GeneralDetailsH2"} classNameLabel={"h2GeneralDetailsLabel"} language={language} />
                <H2Fields label={TEXT.NAME} value={country.name?.[language] || ""} className={"h2GeneralDetails"} classNameH2={"h2GeneralDetailsH2"} classNameLabel={"h2GeneralDetailsLabel"} language={language} />
            </section>
            <section className="generaDatailListContainter">
                {country.provinces?.length > 0 ? (
                    <Ul list={country.provinces} classNameUl={"listGeneralDetailsUl"} classnameli={"listGeneralDetailsLi"} valueH1Field={`${TEXT.PROVINCE_LIST}:`} idH1Field={"listGeneralDetailsH1"} language={language} renderItem={(province) => (
                        <>
                            <H2Fields label={`${TEXT.PROVINCE}`} value={province.name?.[language] || ""} className={"listGeneralDetailsH2Container"} classNameLabel={"listGeneralDetailsH2Label"} classNameH2={"listGeneralDetailsH2Value"} language={language} />
                        </>
                    )}
                    />
                ) : (<p>{TEXT.NO} {TEXT.PROVINCES_ASSOCIATED} CORREGIR ESTILOS</p>)}
            </section>
            <section className="generalDetailBtns">
                <button className="btn btn-outline-dark" id="generalDetailBtnBack" onClick={() => navigate("/countries")}><RiArrowGoBackFill className="iconBtnDetailsBack"/></button>
                <button className="btn btn-outline-primary" id="generalDetailBtnEdit" onClick={() => navigate(`/countries/form/${country._id}`, { state: { country } })}><TbWorldCog className="iconBtnDetailsEdit" /></button>
                <button className="btn btn-outline-danger" id="generalDetailBtnDelete" onClick={handleDelete}><FaRegTrashCan className="iconBtnDetailsDelete" /></button>
            </section>
        </div>
    );
};

export default CountryDetail;