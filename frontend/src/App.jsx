import { useEffect, useState } from "react";
import "./App.css";

const API_URL = "http://localhost:3000";

function App() {
    const [services, setServices] = useState([]);
    const [selectedServiceId, setSelectedServiceId] = useState("");
    const [ticketData, setTicketData] = useState(null);
    const [loadingServices, setLoadingServices] = useState(true);
    const [creatingTicket, setCreatingTicket] = useState(false);
    const [error, setError] = useState("");

    useEffect(() => {
        async function loadServices() {
            try {
                const response = await fetch(`${API_URL}/api/services`);
                const result = await response.json();

                if (!response.ok) {
                    throw new Error(result.message);
                }

                setServices(result.data);
            } catch (requestError) {
                setError("Δεν ήταν δυνατή η φόρτωση των υπηρεσιών.");
            } finally {
                setLoadingServices(false);
            }
        }

        loadServices();
    }, []);

    async function createTicket() {
        if (!selectedServiceId) {
            setError("Παρακαλώ επίλεξε μία υπηρεσία.");
            return;
        }

        setCreatingTicket(true);
        setError("");

        try {
            const response = await fetch(`${API_URL}/api/tickets`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({
                    serviceId: Number(selectedServiceId)
                })
            });

            const result = await response.json();

            if (!response.ok) {
                throw new Error(result.message);
            }

            setTicketData(result.data);
        } catch (requestError) {
            setError(
                requestError.message ||
                "Δεν ήταν δυνατή η δημιουργία εισιτηρίου."
            );
        } finally {
            setCreatingTicket(false);
        }
    }

    function resetTicket() {
        setTicketData(null);
        setSelectedServiceId("");
        setError("");
    }

    return (
        <main className="app-shell">
            <section className="queue-card">
                <header className="app-header">
                    <span className="logo-mark">SQ</span>

                    <div>
                        <h1>SmartQueue</h1>
                        <p>Η έξυπνη διαχείριση της αναμονής σου</p>
                    </div>
                </header>

                {!ticketData ? (
                    <div className="selection-section">
                        <h2>Έκδοση αριθμού προτεραιότητας</h2>
                        <p className="instruction">
                            Επίλεξε την υπηρεσία που θέλεις να
                            επισκεφθείς.
                        </p>

                        {loadingServices ? (
                            <p>Φόρτωση υπηρεσιών...</p>
                        ) : (
                            <div className="service-grid">
                                {services.map((service) => (
                                    <button
                                        key={service.id}
                                        type="button"
                                        className={
                                            selectedServiceId === service.id
                                                ? "service-option selected"
                                                : "service-option"
                                        }
                                        onClick={() => {
                                            setSelectedServiceId(service.id);
                                            setError("");
                                        }}
                                    >
                                        <span className="service-code">
                                            {service.code}
                                        </span>

                                        <strong>{service.name}</strong>

                                        <small>
                                            Μέσος χρόνος εξυπηρέτησης:{" "}
                                            {service.average_service_minutes}′
                                        </small>
                                    </button>
                                ))}
                            </div>
                        )}

                        {error && (
                            <p className="error-message">{error}</p>
                        )}

                        <button
                            type="button"
                            className="primary-button"
                            onClick={createTicket}
                            disabled={
                                !selectedServiceId || creatingTicket
                            }
                        >
                            {creatingTicket
                                ? "Έκδοση..."
                                : "Έκδοση αριθμού"}
                        </button>
                    </div>
                ) : (
                    <div className="ticket-section">
                        <p className="success-label">
                            Το εισιτήριό σου εκδόθηκε
                        </p>

                        <div className="ticket-number">
                            {ticketData.ticket.ticket_number}
                        </div>

                        <h2>{ticketData.service.name}</h2>

                        <div className="ticket-stats">
                            <div>
                                <span>Άτομα μπροστά σου</span>
                                <strong>{ticketData.peopleAhead}</strong>
                            </div>

                            <div>
                                <span>Εκτιμώμενη αναμονή</span>
                                <strong>
                                    {ticketData.estimatedWaitMinutes}′
                                </strong>
                            </div>
                        </div>

                        <p className="ticket-status">
                            Κατάσταση: Σε αναμονή
                        </p>

                        <button
                            type="button"
                            className="secondary-button"
                            onClick={resetTicket}
                        >
                            Έκδοση νέου εισιτηρίου
                        </button>
                    </div>
                )}
            </section>
        </main>
    );
}

export default App;
