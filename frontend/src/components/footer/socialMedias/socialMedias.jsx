import { useContext, useEffect, useState } from "react";
import { UserContext } from "../../../context/User.Context";
import { useLanguage } from "../../../context/Language.Context";
import { useRefresh } from "../../../context/Refresh.Context";
import { useLoading } from "../../../context/Loading.Context";
import { useSweetAlert } from "../../../context/SweetAlert2.Context";
import { LANG_CONST } from "../../../constants/SelectLang.Constant";
import { fetchDeleteSocialById, fetchGetSocialByFilter } from "../../body/socials/socialsLogic";
import Uls from "../../body/generalFields/Uls/Uls";
import SocialsCard from "../../body/socials/socialsCard/socialsCard";
import H2Fields from "../../body/generalFields/h2Fields/h2Fields";

function SocialMedias({ socials }) {
    const [socialMedias, setSocialMedias] = useState([]);
    const { user } = useContext(UserContext);
    const { language } = useLanguage();
    const { refreshKey } = useRefresh();
    /*const [loading, setLoading] = useState(true);
    const { startLoading, stopLoading } = useLoading();*/
    const { confirmSweet, successSweet, errorSweet } = useSweetAlert();
    const TEXT = LANG_CONST[language];

    useEffect(() => {
        const loadSocialMedias = async () => {
            try {
                const result = await fetchGetSocialByFilter({ typeSocial: "Social" });
                if(!result || result.response?.error) {
                    setSocialMedias([]);
                    return await errorSweet(`${TEXT.ERROR}: ${result?.error?.message}` || TEXT.TEXT_ERROR_OOPS);
                };
                const socialMedias = result.response;
                setSocialMedias(socialMedias);
            } catch (error) {
                console.error(`${TEXT.ERROR}: ${error.message}` || TEXT.TEXT_ERROR_OOPS);
                await errorSweet(`${TEXT.ERROR}: ${error.message}` || TEXT.TEXT_ERROR_OOPS);
            }
        };
        loadSocialMedias();
    }, [language, user, refreshKey]);

    const handleDelete = async (id) => {
        try {
            const confirmDelete = await confirmSweet({
                title: TEXT.ARE_YOU_SURE,
                text: TEXT.DELETE_SOCIAL,
                confirmButtonText: TEXT.YES,
                cancelButtonText: TEXT.NO
            });
            if(!confirmDelete) return;
            setLoading(true);
            startLoading();
            const result = await fetchDeleteSocialById(id);
            if(res?.error) return await errorSweet(`${TEXT.ERROR}: ${result?.error?.message}` || TEXT.TEXT_ERROR_OOPS);
            await successSweet(`${TEXT.SOCIAL} ${TEXT.DELETED}!`);
            setSocialMedias(prev => prev.filter(social => social._id !== id));
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
            {socialMedias.length > 0 ? (
                <Uls list={socialMedias} language={language} renderItem={(social) => (
                    <SocialsCard key={social._id} social={social}  onDelete={handleDelete} language={language} />
                )} />
            ): (
                <div className="genListErrContDark">
                    <H2Fields value={`${TEXT.SOCIALS_NOT_FOUND}!`} className="genListErrDark" classNameH2="genListErrH2Dark" language={language} />
                    <img src="/img/not-found.jpg" width={75} height={75} />
                </div>              
            )}
        </div>
    );
};

export default SocialMedias;