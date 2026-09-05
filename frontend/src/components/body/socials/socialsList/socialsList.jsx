import { useContext, useEffect, useState } from "react";
import { UserContext } from "../../../../context/User.Context";
import { useLoading } from "../../../../context/Loading.Context";
import { useLanguage } from "../../../../context/Language.Context";
import { LANG_CONST } from "../../../../constants/SelectLang.Constant";
import { useSweetAlert } from "../../../../context/SweetAlert2.Context";
import { Link, useNavigate } from "react-router-dom";
import { fetchDeleteSocialById, fetchGetAllSocials } from "../socialsLogic";
import Uls from "../../generalFields/Uls/Uls";
import SocialsCard from "../socialsCard/socialsCard";
import H2Fields from "../../generalFields/h2Fields/h2Fields";
import { userVerifyPrivileges } from "../../../../helpers/privileges.helper";

function SocialsList() {
    const { user } = useContext(UserContext);
    const [socials, setSocials] = useState([]);
    const [loading, setLoading] = useState(true);
    const { startLoading, stopLoading } = useLoading();
    const { language } = useLanguage();
    const TEXT = LANG_CONST[language];
    const { errorSweet, successSweet, confirmSweet } = useSweetAlert();
    const navigate = useNavigate();
    const [canCreate, setCanCreate] = useState(false);
    const { verifyPrivileges } = userVerifyPrivileges();

    useEffect(() => {
        const loadSocials = async () => {
            try {
                //FALTA VALIDAR AL USUARIO:
                startLoading();
                const result = await fetchGetAllSocials();
                if(result?.error) {
                    return await errorSweet(`${TEXT.ERROR}: ${result?.error?.message}` || TEXT.TEXT_ERROR_OOPS);
                };
                const socials = result.response || [];
                setSocials(socials);
            } catch (error) {
                setSocials([]);
                console.error(`${TEXT.ERROR}: ${error.message}` || TEXT.TEXT_ERROR_OOPS);
                await errorSweet(`${TEXT.ERROR}: ${error.message}` || TEXT.TEXT_ERROR_OOPS);
            } finally {
                setLoading(false);
                stopLoading();
            }
        };
        loadSocials();
    }, [ user, language]);

    //Verify Privileges:
    useEffect(() => {
        const checkPrivileges = async () => {
            if(!user) {
                setCanCreate(false);
                return;
            };
            const allowed = await verifyPrivileges(user, "create_socials");
            setCanCreate(allowed);
        };
        checkPrivileges();
    }, [user, verifyPrivileges]);

    const handleDelete = async (id) => {
        try {
            if(!id) return await errorSweet(`${TEXT.ERROR}: ${TEXT.MISSING_ID}!`);
            const confirmDelete = await successSweet({
                title: TEXT.ARE_YOU_SURE,
                text: TEXT.DELETE_SOCIAL,
                confirmButtonText: TEXT.YES,
                cancelButtonText: TEXT.NO
            });
            if(!confirmDelete) return;
            setLoading(true);
            startLoading();
            const result = await fetchDeleteSocialById(id);
            if(result?.error) return await errorSweet(`${TEXT.ERROR}: ${result?.error?.message}` || TEXT.TEXT_ERROR_OOPS);
            await successSweet(`FALTA TEXTO SOCIAL DELETED!`);
            setSocials(prev => prev.filter(social => social._id !== id));
        } catch (error) {
            console.error(`${TEXT.ERROR}: ${error.message}` || TEXT.TEXT_ERROR_OOPS);
            await errorSweet(`${TEXT.ERROR}: ${error.message}` || TEXT.TEXT_ERROR_OOPS);
        } finally {
            setLoading(false);
            stopLoading();
        }
    };

    return (
        <div>
            {canCreate && (
                <section>
                    <Link to={"/social/form/new"}>
                        <button type="button" className="btn btn-outline-success" id="btnAddSocial">{`${TEXT.NEW_F} ${TEXT.SOCIAL}`}</button>
                    </Link>
                </section>
            )}
            <section>
                <div>
                    {socials.length > 0 ? (
                        <Uls list={socials} className="" classNameSect="" classNameUl="" classnameli="" renderItem={(social) => (
                            <SocialsCard key={social._id} social={social} onDelete={handleDelete} />
                        )} />
                    ): (
                        <div className="genListErrCont">
                            <H2Fields value={`${TEXT.SOCIALS_NOT_FOUND}!`} className="genListErr" classNameH2="genListErrH2" language={language}/>
                            <img src="/img/not-found.jpg"/>
                        </div>
                    )}
                </div>
            </section>
        </div>
    );
};

export default SocialsList;