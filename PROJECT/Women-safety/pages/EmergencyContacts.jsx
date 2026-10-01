import React, { useState } from "react";

function EmergencyContacts({ navigate }) {
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");

  const [contacts, setContacts] = useState(() => {
    return JSON.parse(
      localStorage.getItem("emergencyContacts") || "[]"
    );
  });

  const addContact = async () => {
    if (!name || !phone) {
      alert("Please enter contact name and phone number.");
      return;
    }

    const loggedInUser = JSON.parse(
      localStorage.getItem("loggedInUser") || "null"
    );

    if (!loggedInUser || !loggedInUser.id) {
      alert("Please login first.");
      return;
    }

    try {
      const response = await fetch(
        "http://localhost:5000/api/contacts",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json"
          },
          body: JSON.stringify({
            user_id: loggedInUser.id,
            name: name,
            mobile: phone
          })
        }
      );

      const data = await response.json();

      if (!response.ok) {
        alert(data.message || "Failed to add contact.");
        return;
      }

      const newContact = {
        id: data.contactId,
        name: name,
        phone: phone
      };

      const updatedContacts = [
        ...contacts,
        newContact
      ];

      setContacts(updatedContacts);

      localStorage.setItem(
        "emergencyContacts",
        JSON.stringify(updatedContacts)
      );

      setName("");
      setPhone("");

      alert("✅ Contact Added Successfully!");
    } catch (error) {
      console.error(error);
      alert("Cannot connect to backend.");
    }
  };

  const deleteContact = (id) => {
    const updatedContacts = contacts.filter(
      (contact) => contact.id !== id
    );

    setContacts(updatedContacts);

    localStorage.setItem(
      "emergencyContacts",
      JSON.stringify(updatedContacts)
    );

    alert("🗑️ Contact Deleted Successfully!");
  };

  return (
    <div className="simple-page">

      <div className="page-card">

        <h1>Emergency Contacts</h1>

        <p>
          Add people who should be contacted during an emergency.
        </p>

        <div className="contact-form">

          <input
            type="text"
            placeholder="Contact Name"
            value={name}
            onChange={(e) => setName(e.target.value)}
          />

          <input
            type="tel"
            placeholder="Phone Number"
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
          />

          <button
            className="primary-button"
            onClick={addContact}
          >
            Add Contact
          </button>

        </div>

        <div className="contacts-list">

          {contacts.length === 0 ? (

            <p className="empty-message">
              No emergency contacts added yet.
            </p>

          ) : (

            contacts.map((contact) => (

              <div
                className="contact-item"
                key={contact.id}
              >

                <div>
                  <strong>{contact.name}</strong>

                  <p>{contact.phone}</p>
                </div>

                <button
                  className="delete-button"
                  onClick={() =>
                    deleteContact(contact.id)
                  }
                >
                  Delete
                </button>

              </div>

            ))

          )}

        </div>

        <button
          className="back-dashboard"
          onClick={() => navigate("dashboard")}
        >
          ← Back to Dashboard
        </button>

      </div>

    </div>
  );
}

export default EmergencyContacts;