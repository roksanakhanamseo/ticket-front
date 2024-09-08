import { useState, useEffect } from "react";
import Footer from "../components/moleculas/Footer";
import { useNavigate } from "react-router-dom";
import { useQueryClient, useMutation, useQuery } from "@tanstack/react-query";
import { toast } from "react-toastify";
import Loader from "../components/Loader/Loader";

const NewTicket = () => {
  useEffect(() => {
    if (localStorage.getItem("auth") == null) {
      toast.error("Please login first");
      navigate("/login");
    }
  }, []);

  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const [formData, setFormData] = useState({
    seating: "",
    payment: "",
    description: "",
  });

  const { data: userData, isFetching } = useQuery({
    queryKey: ["user"],
    queryFn: () => {
      return fetch(
        "https://ticket-back-production.up.railway.app/api/users/me",
        {
          method: "GET",
          headers: {
            authorization: `${localStorage.getItem("auth")}`,
            "Content-Type": "application/json",
          },
        }
      ).then((res) => res.json());
    },
    refetchOnWindowFocus: false,
  });

  const newTicketFn = () => {
    let seating = document.getElementById("seating").value;
    let payment = document.getElementById("payment").value;
    let description = document.getElementById("description").value;
    setFormData({ seating, payment, description });
    const data = fetch(
      "https://ticket-back-production.up.railway.app/api/tickets",
      {
        method: "POST",
        headers: {
          authorization: `${localStorage.getItem("auth")}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      }
    );
    console.log(data);
    return data;
  };

  const Mutation = useMutation({
    mutationFn: () => newTicketFn(),
    onSuccess: (data) => {
      console.log(data);
      data.json().then((e) => {
        if (e.message == "Please add a seating and description") {
          toast.error("Please add a seating and description");
        } else {
          queryClient.invalidateQueries(["ticket"]);
          toast.success("Ticket created successfully");
          navigate("/tickets");
        }
      });
    },
    onError: (error) => {
      toast.error(error);
    },
  });
  if (isFetching) return <Loader />;
  return (
    <div className="bg-gray-500 relative top-0 mix-blend-difference">
      <div className="w-[80%]  mx-auto">
        <div className="text-center text-4xl pt-10  pt-30 pb-5">
          Create New Ticket
        </div>
        <div className="text-center text-3xl pb-5">
          Please fill out the form below
        </div>
        <form className="w-[80%] mx-auto rounded-lg h-full" action="">
          <label htmlFor="name" className=" py-3">
            Name :
          </label>
          <input
            type="text"
            value={userData.name}
            className="w-full px-4 py-2 border rounded-md"
            disabled
          />
          <label className=" py-3" htmlFor="email">
            Email :
          </label>
          <input
            type="text"
            value={userData.email}
            className="w-full px-4 py-2 border rounded-md"
            disabled
          />
          <label htmlFor="seating-label " className=" py-3">
            Seating Location:
          </label>
          <select
            className="w-full px-4 py-2 mt-1 border rounded-md"
            name="seating"
            id="seating"
            defaultValue="Platinum"
            defaultChecked="Platinum"
          >
            <option value="Platinum">Platinum</option>
            <option value="Gold">Gold</option>
            <option value="Silver">Silver</option>
            <option value="Reguler">Reguler</option>
          </select>
          <label htmlFor="payment-label" className=" py-3">
            Payment Options:
          </label>
          <select
            className="w-full px-4 py-2 mt-1 border rounded-md"
            name="payment"
            defaultChecked="Visa"
            defaultValue="Visa"
            id="payment"
          >
            <option value="Visa">Visa</option>
            <option value="Mastercard">Master Card</option>
            <option value="American Express">American Express</option>
          </select>
          <label htmlFor="describe-label " className=" py-3">
            Describe Something You Have Any Query :
          </label>
          <textarea
            id="description"
            name="description"
            rows={4}
            className="mt-3 p-5 w-full block bg-slate-200 h-32 rounded-md"
          ></textarea>
          <button
            onClick={(e) => {
              e.preventDefault();
              Mutation.mutate();
            }}
            className="bg-slate-400 hover:bg-slate-500 hover:border active:scale-95 w-full px-4 py-3 rounded-lg my-3"
          >
            Continue
          </button>
        </form>
      </div>
      <div className="text-slate-300 mt-20 bg-black">
        {" "}
        <Footer />
      </div>
    </div>
  );
};

export default NewTicket;
