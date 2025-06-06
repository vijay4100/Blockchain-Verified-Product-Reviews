import React, { useState, useEffect } from "react";
import { BrowserProvider, Contract } from "ethers";
import productReviewAbi from "./ProductReview.json";

const contractAddress = "0xF51b8bfD5fFE4269A1389EcB7597aFcF307AaE3В"; // Replace me!

const ProductReviewApp = () => {
  const [account, setAccount] = useState("");
  const [contract, setContract] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [productName, setProductName] = useState("");
  const [productId, setProductId] = useState("");
  const [rating, setRating] = useState("");
  const [comment, setComment] = useState("");
  const [reviews, setReviews] = useState([]);

  useEffect(() => {
    const init = async () => {
      if (!window.ethereum) {
        setError("MetaMask not detected. Please install MetaMask.");
        setLoading(false);
        return;
      }

      try {
        const provider = new BrowserProvider(window.ethereum);
        await provider.send("eth_requestAccounts", []);
        const signer = await provider.getSigner();
        const address = await signer.getAddress();
        const contractInstance = new Contract(contractAddress, productReviewAbi.abi, signer);

        setAccount(address);
        setContract(contractInstance);
        setError("");
      } catch (err) {
        setError("Failed to connect wallet or contract.");
        console.error(err);
      }
      setLoading(false);
    };

    init();
  }, []);

  const addProduct = async () => {
    if (!productName.trim()) return alert("Please enter a product name.");
    try {
      const tx = await contract.addProduct(productName);
      await tx.wait();
      alert("🎉 Product added!");
      setProductName("");
    } catch (err) {
      alert("❌ Failed to add product.");
      console.error(err);
    }
  };

  const submitReview = async () => {
    if (!productId || !rating || !comment.trim()) {
      return alert("Please fill in all review fields.");
    }
    if (rating < 0 || rating > 5) {
      return alert("Rating must be between 0 and 5.");
    }

    try {
      const tx = await contract.submitReview(productId, parseInt(rating), comment);
      await tx.wait();
      alert("✅ Review submitted!");
      setRating("");
      setComment("");
    } catch (err) {
      alert("❌ Failed to submit review.");
      console.error(err);
    }
  };

  const getReviews = async () => {
    if (!productId) return alert("Enter a Product ID to fetch reviews.");
    try {
      const result = await contract.getReviews(productId);
      setReviews(result);
    } catch (err) {
      alert("❌ Failed to fetch reviews.");
      console.error(err);
    }
  };

  if (loading) return <h2 style={{ textAlign: "center", marginTop: "50px" }}>🔄 Connecting to MetaMask...</h2>;

  if (error) return <h2 style={{ textAlign: "center", color: "red", marginTop: "50px" }}>{error}</h2>;

  return (
    <div
      style={{
        maxWidth: 800,
        margin: "40px auto",
        padding: 20,
        fontFamily: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif",
        backgroundColor: "#f0f8ff",
        borderRadius: 12,
        boxShadow: "0 8px 20px rgba(0,0,0,0.1)",
      }}
    >
      <h1 style={{ textAlign: "center", color: "#2a52be" }}>🛍️ Product Review DApp</h1>
      <p style={{ textAlign: "center", fontWeight: "bold", color: "#555" }}>
        Wallet Connected: <span style={{ color: "#1e90ff" }}>{account}</span>
      </p>

      {/* Add Product */}
      <section
        style={{
          backgroundColor: "#e6f0ff",
          padding: "15px 20px",
          borderRadius: 8,
          marginBottom: 25,
          border: "1px solid #b0c4de",
        }}
      >
        <h2 style={{ color: "#1e90ff" }}>Add New Product</h2>
        <input
          type="text"
          placeholder="Product name"
          value={productName}
          onChange={(e) => setProductName(e.target.value)}
          style={{
            width: "70%",
            padding: 8,
            marginRight: 12,
            borderRadius: 6,
            border: "1px solid #ccc",
          }}
        />
        <button
          onClick={addProduct}
          style={{
            padding: "8px 18px",
            backgroundColor: "#1e90ff",
            border: "none",
            borderRadius: 6,
            color: "white",
            fontWeight: "bold",
            cursor: "pointer",
          }}
        >
          Add
        </button>
      </section>

      {/* Submit Review */}
      <section
        style={{
          backgroundColor: "#f9f9f9",
          padding: "15px 20px",
          borderRadius: 8,
          marginBottom: 25,
          border: "1px solid #ddd",
        }}
      >
        <h2 style={{ color: "#2e8b57" }}>Submit a Review</h2>
        <input
          type="number"
          placeholder="Product ID"
          value={productId}
          onChange={(e) => setProductId(e.target.value)}
          style={{ padding: 8, width: 120, marginRight: 12, borderRadius: 6, border: "1px solid #ccc" }}
        />
        <input
          type="number"
          placeholder="Rating (0-5)"
          value={rating}
          onChange={(e) => setRating(e.target.value)}
          style={{ padding: 8, width: 120, marginRight: 12, borderRadius: 6, border: "1px solid #ccc" }}
          min={0}
          max={5}
        />
        <br />
        <br />
        <input
          type="text"
          placeholder="Comment"
          value={comment}
          onChange={(e) => setComment(e.target.value)}
          style={{ padding: 8, width: "80%", borderRadius: 6, border: "1px solid #ccc" }}
        />
        <br />
        <br />
        <button
          onClick={submitReview}
          style={{
            padding: "10px 22px",
            backgroundColor: "#2e8b57",
            border: "none",
            borderRadius: 6,
            color: "white",
            fontWeight: "bold",
            cursor: "pointer",
          }}
        >
          Submit Review
        </button>
      </section>

      {/* View Reviews */}
      <section
        style={{
          backgroundColor: "#fff4e6",
          padding: "15px 20px",
          borderRadius: 8,
          border: "1px solid #ffd580",
        }}
      >
        <h2 style={{ color: "#d2691e" }}>View Reviews</h2>
        <input
          type="number"
          placeholder="Product ID"
          value={productId}
          onChange={(e) => setProductId(e.target.value)}
          style={{ padding: 8, width: 150, marginRight: 12, borderRadius: 6, border: "1px solid #ccc" }}
        />
        <button
          onClick={getReviews}
          style={{
            padding: "8px 18px",
            backgroundColor: "#d2691e",
            border: "none",
            borderRadius: 6,
            color: "white",
            fontWeight: "bold",
            cursor: "pointer",
          }}
        >
          Fetch Reviews
        </button>

        <ul style={{ marginTop: 20 }}>
          {reviews.length === 0 ? (
            <p style={{ color: "#999" }}>No reviews found.</p>
          ) : (
            reviews.map((r, i) => (
              <li
                key={i}
                style={{
                  backgroundColor: "white",
                  padding: 12,
                  borderRadius: 8,
                  marginBottom: 10,
                  boxShadow: "0 2px 6px rgba(0,0,0,0.1)",
                }}
              >
                <strong>👤 Reviewer:</strong> <span style={{ color: "#555" }}>{r.reviewer}</span>
                <br />
                <strong>⭐ Rating:</strong> {r.rating}
                <br />
                <strong>📝 Comment:</strong> {r.comment}
              </li>
            ))
          )}
        </ul>
      </section>
    </div>
  );
};

export default ProductReviewApp;
