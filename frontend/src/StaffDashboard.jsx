import { useEffect, useState } from "react";

const API_URL =
  import.meta.env.VITE_API_URL || "http://localhost:3000/api";

function StaffDashboard() {
  const [services, setServices] = useState([]);
  const [serviceId, setServiceId] = useState("");
  const [counterId, setCounterId] = useState("1");
  const [currentTicket, setCurrentTicket] = useState(null);
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    async function loadServices() {
      try {
        const response = await fetch(`${API_URL}/services`);
        const result = await response.json();

        if (!response.ok) {
          throw new Error(result.message);
        }

        setServices(result.data);

        if (result.data.length > 0) {
          setServiceId(String(result.data[0].id));
        }
      } catch (error) {
        setMessage(error.message || "Αποτυχία φόρτωσης υπηρεσιών");
      }
    }

    loadServices();
  }, []);

  async function callNextTicket() {
    setLoading(true);
    setMessage("");

    try {
      const response = await fetch(`${API_URL}/queue/call-next`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          serviceId: Number(serviceId),
          counterId: Number(counterId)
        })
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.message);
      }

      setCurrentTicket(result.data.ticket);
      setMessage("Το επόμενο εισιτήριο κλήθηκε επιτυχώς");
    } catch (error) {
      setMessage(error.message || "Η κλήση απέτυχε");
    } finally {
      setLoading(false);
    }
  }

  async function completeTicket() {
    setLoading(true);
    setMessage("");

    try {
      const response = await fetch(
        `${API_URL}/queue/tickets/${currentTicket.id}/complete`,
        {
          method: "PATCH"
        }
      );

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.message);
      }

      setMessage(`Το εισιτήριο ${currentTicket.ticket_number} ολοκληρώθηκε`);
      setCurrentTicket(null);
    } catch (error) {
      setMessage(error.message || "Η ολοκλήρωση απέτυχε");
    } finally {
      setLoading(false);
    }
  }

  return (
    <main style={styles.page}>
      <section style={styles.card}>
        <header style={styles.header}>
          <div style={styles.logo}>SQ</div>
          <div>
            <h1 style={styles.title}>SmartQueue</h1>
            <p style={styles.subtitle}>Πίνακας υπαλλήλου</p>
          </div>
        </header>

        <div style={styles.content}>
          <label style={styles.label}>
            Υπηρεσία
            <select
              style={styles.input}
              value={serviceId}
              onChange={(event) => setServiceId(event.target.value)}
            >
              {services.map((service) => (
                <option key={service.id} value={service.id}>
                  {service.name}
                </option>
              ))}
            </select>
          </label>

          <label style={styles.label}>
            Αριθμός γκισέ
            <input
              style={styles.input}
              type="number"
              min="1"
              value={counterId}
              onChange={(event) => setCounterId(event.target.value)}
            />
          </label>

          <div style={styles.ticketBox}>
            <p style={styles.ticketLabel}>Τρέχον εισιτήριο</p>
            <strong style={styles.ticketNumber}>
              {currentTicket?.ticket_number || "—"}
            </strong>
            <p>
              {currentTicket
                ? `Εξυπηρετείται στο γκισέ ${currentTicket.counter_id}`
                : "Δεν εξυπηρετείται κάποιο εισιτήριο"}
            </p>
          </div>

          {message && <p style={styles.message}>{message}</p>}

          <button
            style={styles.primaryButton}
            onClick={callNextTicket}
            disabled={loading || !serviceId || currentTicket}
          >
            {loading ? "Παρακαλώ περιμένετε..." : "Κλήση επόμενου"}
          </button>

          <button
            style={{
              ...styles.completeButton,
              opacity: currentTicket ? 1 : 0.5
            }}
            onClick={completeTicket}
            disabled={loading || !currentTicket}
          >
            Ολοκλήρωση εξυπηρέτησης
          </button>
        </div>
      </section>
    </main>
  );
}

const styles = {
  page: {
    minHeight: "100vh",
    display: "grid",
    placeItems: "center",
    padding: "24px",
    background: "#eaf1ff",
    fontFamily: "Arial, sans-serif"
  },
  card: {
    width: "100%",
    maxWidth: "650px",
    overflow: "hidden",
    borderRadius: "28px",
    background: "white",
    boxShadow: "0 20px 55px rgba(26, 68, 150, 0.18)"
  },
  header: {
    display: "flex",
    alignItems: "center",
    gap: "18px",
    padding: "32px",
    color: "white",
    background: "linear-gradient(135deg, #204bd9, #2f69ed)"
  },
  logo: {
    display: "grid",
    placeItems: "center",
    width: "64px",
    height: "64px",
    border: "2px solid #9bbaff",
    borderRadius: "20px",
    fontSize: "22px",
    fontWeight: "bold"
  },
  title: {
    margin: 0,
    fontSize: "34px"
  },
  subtitle: {
    margin: "6px 0 0",
    fontSize: "18px"
  },
  content: {
    display: "grid",
    gap: "20px",
    padding: "32px"
  },
  label: {
    display: "grid",
    gap: "8px",
    fontWeight: "bold",
    color: "#26344f"
  },
  input: {
    padding: "14px",
    border: "1px solid #c8d4ea",
    borderRadius: "12px",
    background: "white",
    fontSize: "16px"
  },
  ticketBox: {
    padding: "26px",
    borderRadius: "18px",
    textAlign: "center",
    background: "#f4f7fc"
  },
  ticketLabel: {
    margin: 0,
    color: "#687895"
  },
  ticketNumber: {
    display: "block",
    margin: "10px 0",
    color: "#2456dc",
    fontSize: "58px"
  },
  message: {
    margin: 0,
    padding: "12px",
    borderRadius: "10px",
    textAlign: "center",
    background: "#eef5ff",
    color: "#1743b5"
  },
  primaryButton: {
    padding: "16px",
    border: 0,
    borderRadius: "13px",
    color: "white",
    background: "#2456dc",
    fontSize: "17px",
    fontWeight: "bold",
    cursor: "pointer"
  },
  completeButton: {
    padding: "16px",
    border: 0,
    borderRadius: "13px",
    color: "white",
    background: "#15956f",
    fontSize: "17px",
    fontWeight: "bold",
    cursor: "pointer"
  }
};

export default StaffDashboard;