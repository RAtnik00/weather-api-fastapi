export default function Card({ title, action, children }) {
    return (
        <div className="card">
            {(title || action) && (
                <div className="cardHeader">
                    {title && <div className="cardTitle">{title}</div>}
                    {action}
                </div>
            )}

            {children}
        </div>
    );
}