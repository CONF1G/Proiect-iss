import React, { useState } from "react";
import axios from "axios";
import { Link, useLocation, useNavigate } from "react-router-dom";

const Update = () => {
    const [book, setBook] = useState({
        title: "",
        desc: "",
        price: null,
        cover: "",

    });

    const [error, SetError] = useState(false);

    const location = useLocation();
    const navigate = useNavigate();

    const bookId = location.pathname.split("/")[2];

    const handleChange = (e) => {
        setBook((prev) => ({ ...prev, [e.target.name]: e.target.value }));
    };

    const handleClick = async (e) => {
        e.preventDefault();

        try {
            await axios.put(`http://localhost:3300/books/${bookId}`, book);
            navigate("/");
        } catch (err) {
            console.log(err);
            SetError(true);
        }
    };

    return (
        <div className="form">
        <h1>Update the book</h1>
        <input
        type="text"
        placeholder="Book title"
        name="title"
        onChange={handleChange}
      />
      <textarea
        rows={5}
        type="text"
        placeholder="Book desc"
        name="desc"
        onChange={handleChange}
      />
      <input
        type="number"
        placeholder="Book price"
        name="price"
        onChange={handleChange}
      />
      <input
        type="text"
        placeholder="Book cover"
        name="cover"
        onChange={handleChange}
      />
      <button onClick={handleClick}>Update</button>
      {error && "Something went wrong!"}
      <Link to="/">See all books</Link>
        </div>


    );
};

export default Update;