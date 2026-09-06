function Ols( { items = [], setItems, renderItem, getId= (item) => item._id, orderField="order",
    clOl="ols", clLi="olsItem", clItemCont="olsContent", clButtonsCont="olsActions", clButtons="olsButton"
}) {
    
    const sortedItems = [...items].sort((a, b) => Number(a[orderField] || 0) - Number(b[orderField] || 0));
    const updateItems = (newItems) => {
        const orderedItems = newItems.map((item, index) => ({ ...item, [orderField]: index + 1 }));
        setItems(orderedItems);
    };
    
    const hanldeMoveUp = (index) => {
        if(index <= 0) return;
        const newItems = [...sortedItems];
        const temp = newItems[index - 1];
        newItems[index - 1] = newItems[index];
        newItems[index] = temp;
        updateItems(newItems);
    };

    const handleMoveDown = (index) => {
        if(index >= sortedItems.length - 1) return;
        const newItems = [...sortedItems];
        const temp = newItems[index];
        newItems[index] = newItems[index + 1];
        newItems[index + 1] = temp;
        updateItems(newItems);
    };

    return(
        <ol className={clOl}>
            {sortedItems.map((item, index) => (
                <li key={getId(item)} className={clLi}>
                    <div className={clItemCont}>
                        {renderItem(item, index)}
                    </div>
                    <div className={clButtonsCont}>
                        <button type="button" onClick={() => hanldeMoveUp(index)} disabled={index === 0} title="FLATA TEXTO UP" className={`btn btn-outline-success ${clButtons}`}>↑</button>
                        <button type="button" onClick={() => handleMoveDown(index)} disabled={ index === sortedItems.length - 1} title="FALTA TEXT DOWN" className={`btn btn-outline-danger ${clButtons}`}>↓</button>
                    </div>
                </li>
            ))}
        </ol>
    );
};
export default Ols;