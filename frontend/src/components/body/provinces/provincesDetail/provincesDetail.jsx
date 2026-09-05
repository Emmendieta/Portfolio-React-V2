import { useContext, useEffect, useState } from "react";
import { UserContext } from "../../../../context/UserContext";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import { useLoading } from "../../../../context/LoadingContext";
import { useLanguage } from "../../../../context/LanguageContext";
import { LANG_CONST } from "../../../../constants/selectConstLang";
import H1Fields from "../../GeneralFields/H1Fields/H1Fields";
import H2Fields from "../../GeneralFields/H2Fields/H2Fields";
import { FaRegTrashCan } from "react-icons/fa6";
import { TbWorldCog } from "react-icons/tb";
import { useConfirmSweet } from "../../../../context/SweetAlert2Context";
import { fetchDeleteProvinceById, fethProvinceByIdPopulate } from "../ProvincesLogic";
import Ul from "../../GeneralFields/Ul/Ul";
import { RiArrowGoBackFill } from "react-icons/ri";

function ProvinceDetail() {
    const { user } = useContext(UserContext);
    const { state } = useLocation();
    const { id } = useParams();
    const [loading, setLoading] = useState(true);
    const [province, setProvince] = useState(null);
    const { startLoading, stopLoading } = useLoading();
    const { language } = useLanguage();
    const TEXT = LANG_CONST[language];
    const { errorSweet, successSweet, confirmSweet } = useConfirmSweet();
    const navigate = useNavigate();

    useEffect(() => {
        const loadProvince = async () => {
            try {
                //FALTA VALIDAR AL USUARIO
                startLoading();
                if(state?.province) {
                    await new Promise(resolve => setTimeout(resolve, 600));
                    setProvince(state.province);
                    return;
                } else {
                    if(id !== "new") {
                        const result = await fethProvinceByIdPopulate(id);
                        if(result?.error) {
                            await errorSweet(result?.error.message || TEXT.TEXT_ERROR_OOPS);
                            return;
                        };
                        const data = result.response || [];
                        setProvince(data);
                    }
                }
            } catch (error) {
                await errorSweet(error.message);
                console.error("Error: ", error.message);
            } finally {
                setLoading(false);
                stopLoading();
            }
        };
        loadProvince();
    }, [id, state, user, language]);

    const handleDelete = async () => {
        try {
            const confirmDelete = await confirmSweet({
                title: TEXT.ARE_YOU_SURE,
                text: TEXT.DELETE_PROVINCE,
                confirmButtonText: TEXT.YES,
                cancelButtonText: TEXT.NO
            });
            if(!confirmDelete) return;
            const result = await fetchDeleteProvinceById(province._id);
            if(result?.error) throw new Error(result.error.message || TEXT.TEXT_ERROR_OOPS);
            await successSweet(TEXT.PROVINCE + " " + TEXT.DELETED);
            navigate("/provinces");
        } catch (error) {
            await errorSweet(error.message);
            console.error("Error: ", error.message);
        }
    };

    if(!province) return <p>No Province data Available!</p>

    return (
        <div className="generalDetailContainer">
            <section className="generalDetailTitle">
                <H1Fields label={TEXT.PROVINCE_DETAIL} language={language} />
            </section>
            <section className="generalDetailInfo">
                <H2Fields label={TEXT.ID} value={province._id} className={"h2GeneralDetails"} classNameH2={"h2GeneralDetailsH2"} classNameLabel={"h2GeneralDetailsLabel"} language={language} />
                <H2Fields label={TEXT.NAME} value={province.name?.[language] || ""} className={"h2GeneralDetails"} classNameH2={"h2GeneralDetailsH2"} classNameLabel={"h2GeneralDetailsLabel"} language={language} />
            </section>
            <section className="generaDatailListContainter">
                {province.cities?.length > 0 ? (
                    <Ul list={province.cities} classNameUl={"listGeneralDetailsUl"} classnameli={"listGeneralDetailsLi"} valueH1Field={`${TEXT.CITIES_LIST}:`} idH1Field={"listGeneralDetailsH1"} language={language} renderItem={(city) => (
                        <H2Fields label={`${TEXT.CITY}`} value={city.name?.[language] || ""}  className={"subListGeneralDetailsH2Container"} classNameLabel={"subListGeneralDetailsH2Label"} classNameH2={"subListGeneralDetailsH2Value"} language={language} />
                    )} />
                ): (
                    <p>NO CITIES (CAMBIAR DESPUES)</p>
                )}
            </section>
            <section className="generalDetailBtns">
                <button className="btn btn-outline-dark" id="generalDetailBtnBack" onClick={() => navigate("/provinces")}><RiArrowGoBackFill className="iconBtnDetailsBack"/></button>
                <button className="btn btn-outline-primary" id="generalDetailBtnEdit" onClick={()=> navigate(`/provinces/form/${province._id}`, { state: { province }})}><TbWorldCog className="iconBtnDetailsEdit" /></button>
                <button className="btn btn-outline-danger" id="generalDetailBtnDelete" onClick={handleDelete}><FaRegTrashCan className="iconBtnDetailsDelete" /></button>
            </section>
        </div>
    );
};

export default ProvinceDetail;