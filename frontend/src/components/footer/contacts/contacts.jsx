import { useContext, useEffect, useState } from "react";
import { UserContext } from "../../../context/User.Context";
import { useLanguage } from "../../../context/Language.Context";
import { LANG_CONST } from "../../../constants/SelectLang.Constant";
import { useRefresh } from "../../../context/Refresh.Context";
import { useSweetAlert } from "../../../context/SweetAlert2.Context";
import { useLoading } from "../../../context/Loading.Context";
import { fetchDeleteSocialById } from "../../body/socials/socialsLogic";
import Uls from "../../body/generalFields/Uls/Uls";
import SocialsCard from "../../body/socials/socialsCard/socialsCard";
import H2Fields from "../../body/generalFields/h2Fields/h2Fields";

function Contacts({ contacts }) {
    /* const [contacts, setContacts] = useState([]); */
    const { user } = useContext(UserContext);
    const { language } = useLanguage();
    const { refreshKey } = useRefresh();
    const [loading, setLoading] = useState(true);
    const { startLoading, stopLoading } = useLoading();
    const { confirmSweet, successSweet, errorSweet } = useSweetAlert();
    const TEXT = LANG_CONST[language];

    const handleDelete = async (id) => {
        try {
            const confirmDelete = await confirmSweet({
                title: TEXT.ARE_YOU_SURE,
                text: TEXT.DELETE_CONTACT,
                confirmButtonText: TEXT.YES,
                cancelButtonText: TEXT.NO
            });
            if (!confirmDelete) return;
            setLoading(true);
            startLoading();
            const result = await fetchDeleteSocialById(id);
            if (result?.error) return await errorSweet(`${TEXT.ERROR}: ${result?.error?.message}` || TEXT.TEXT_ERROR_OOPS);
            await successSweet(`${TEXT.CONTACT} ${TEXT.DELETED}!`)
            setContacts(prev => prev.filter(contact => contact._id !== id));
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
            {contacts.length > 0 ? (
                <Uls list={contacts} language={language} renderItem={(contact) => (
                    <SocialsCard key={contact._id} social={contact} language={language} onDelete={handleDelete} />
                )} className="socialsListCont" classNameUl="socialsListUl" classnameli="socialsListLi" />
            ) : (
                <div className="genListErrContDark">
                    <H2Fields value={`${TEXT.CONTACTS_NOT_FOUND}!`} className="genListErrDark" classNameH2="genListErrH2Dark" language={language} />
                    <img src="/img/not-found.jpg" width={75} height={75} />
                </div>
            )}
        </div>
    );
};
export default Contacts;