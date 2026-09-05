import { useContext, useEffect, useState } from "react";
import { UserContext } from "../../../../context/User.Context";
import { useLanguage } from "../../../../context/Language.Context";
import { useSweetAlert } from "../../../../context/SweetAlert2.Context";
import { LANG_CONST } from "../../../../constants/SelectLang.Constant";
import { useNavigate } from "react-router-dom";
import { useLoading } from "../../../../context/Loading.Context";
import { fetchGetAllPeoplePopulate } from "../peopleLogic";
import H2Fields from "../../generalFields/h2Fields/h2Fields";
import { formatDate } from "../../../../helpers/formatDate.helper";
import "./peoplePresentation.css";
import { FaUserEdit } from "react-icons/fa";
import { userVerifyPrivileges } from "../../../../helpers/privileges.helper";

function PeoplePresentation() {

    const { user } = useContext(UserContext);
    const { language } = useLanguage();
    const { errorSweet, confirmSweet, successSweet } = useSweetAlert();
    const [loading, setLoading] = useState(true);
    const { startLoading, stopLoading } = useLoading();
    const TEXT = LANG_CONST[language];
    const [people, setPeople] = useState([]);
    const navigate = useNavigate();
    const [canEdit, setCanEdit] = useState(false);
    const { verifyPrivileges } = userVerifyPrivileges();

    useEffect(() => {
        const loadPeople = async () => {
            try {
                startLoading();
                const result = await fetchGetAllPeoplePopulate();
                if (result?.error) {
                    setPeople([]);
                    return await errorSweet(`${TEXT.ERROR}: ${result?.error?.message}` || TEXT.TEXT_ERROR_OOPS);
                };
                const people = result.response || [];
                setPeople(people[0]);
            } catch (error) {
                setPeople([]);
                console.error(`${TEXT.ERROR}: ${error.message}` || TEXT.TEXT_ERROR_OOPS);
                await errorSweet(`${TEXT.ERROR}: ${error.message}` || TEXT.TEXT_ERROR_OOPS);
            } finally {
                setLoading(false);
                stopLoading();
            }
        };
        loadPeople();
    }, [user, language]);

    //Verify Privileges:
    useEffect(() => {
        const checkPrivileges = async () => {
            if(!user) {
                setCanEdit(false);
                return;
            };
            const allowed = await verifyPrivileges(user, "update_people");
            setCanEdit(allowed);
        };
        checkPrivileges();
    }, [user, verifyPrivileges]);

    return (
        <div className="peoPresentCont">
            <section className="peoPresentBannerCont">
                {<img src={people?.images?.[1]?.url || "/img/imagen-no-disponible.png"} alt={people._id} className="peoPresentBanner" onError={(e) => { e.currentTarget.src="/img/imagen-no-disponible.png"}} />}
            </section>
            <section className="peoPresentImgCont">
                <img src={people?.images?.[0]?.url || "/img/imagen-no-disponible.png"} alt={people._id} className="peoPresentProfImg" onError={(e) => { e.currentTarget.src = "/img/imagen-no-disponible.png"}} />
            </section>
            <section className="peoPresentBodyCont">
                <div className="peoPresentBodyInfo">
                    <H2Fields label={TEXT.FULL_NAME} value={`${people.lastName} ${people.firstName}`} language={language}
                        className="lightCardH2FieldCont" classNameH2="lightCardH2Text" classNameLabel="lightCardH2Label" />
                    <H2Fields label={TEXT.BIRTHDAY} value={`${formatDate(people.birthday)}`} language={language}
                        className="lightCardH2FieldCont" classNameH2="lightCardH2Text" classNameLabel="lightCardH2Label" />
                    <H2Fields label={TEXT.AGE} value={`${people.age} ${TEXT.AGE.toLowerCase()}`} language={language}
                        className="lightCardH2FieldCont" classNameH2="lightCardH2Text" classNameLabel="lightCardH2Label" />
                    <H2Fields label={TEXT.JOB_TITLE} value={`${people.jobTitle?.[language] || ""}`} language={language}
                        className="lightCardH2FieldCont" classNameH2="lightCardH2Text" classNameLabel="lightCardH2Label" />
                    <H2Fields label={TEXT.PROVINCE} value={`${people.provinces?.name?.[language] || ""}`} language={language}
                        className="lightCardH2FieldCont" classNameH2="lightCardH2Text" classNameLabel="lightCardH2Label" />
                    <H2Fields label={TEXT.COUNTRY} value={`${people.countries?.name?.[language] || ""}`} language={language}
                        className="lightCardH2FieldCont" classNameH2="lightCardH2Text" classNameLabel="lightCardH2Label" />
                </div>
                <div className="peoPresentBodyAbout">
                    <H2Fields label={TEXT.ABOUT_ME} value={`${people.aboutMe?.[language] || ""}`} language={language}
                        className="lightCardH2FieldContColumn" classNameH2="lightCardH2Text" classNameLabel="lightCardH2Label" />
                </div>
            </section>
            <section className="peoPresentBtnCont">
                {canEdit && (
                    <button type="button" className="btn btn-outline-primary" onClick={() => navigate(`/people/form/${people._id}`)}><FaUserEdit /></button>
                )}
                <button type="button" className="btn btn-outline-success" onClick={() => navigate(`/people/details/${people._id}`)}>{TEXT.MORE_ABOUT_ME }</button>
            </section>
        </div>
    );
};

export default PeoplePresentation;