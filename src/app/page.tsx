"use client";

import { Advocates } from "@/db/schema";
import { formatPhoneNumber } from "@/utils/formatPhoneNumber";
import { useEffect, useState } from "react";

export default function Home() {
  const [advocates, setAdvocates] = useState<Advocates[]>([]);
  const [filteredAdvocates, setFilteredAdvocates] = useState<Advocates[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    console.log("fetching advocates...");
    setIsLoading(true);
    fetch("/api/advocates").then((response) => {
      response.json().then((jsonResponse) => {
        console.log({ data: jsonResponse.data });
        setAdvocates(jsonResponse.data);
        setFilteredAdvocates(jsonResponse.data);
        setIsLoading(false);
      });
    });
  }, []);

  useEffect(() => {
    console.log("filtering advocates...");
    const filteredAdvocates = advocates.filter((advocate) => {
      const lowerCaseSearchTerm = searchTerm.toLowerCase();
      return (
        advocate.firstName.toLowerCase().includes(lowerCaseSearchTerm) ||
        advocate.lastName.toLowerCase().includes(lowerCaseSearchTerm) ||
        advocate.city.toLowerCase().includes(lowerCaseSearchTerm) ||
        advocate.degree.toLowerCase().includes(lowerCaseSearchTerm) ||
        advocate.specialties.includes(lowerCaseSearchTerm) ||
        advocate.yearsOfExperience.toString().includes(searchTerm)
      );
    });

    setFilteredAdvocates(filteredAdvocates);
  }, [searchTerm]);

  const resetSearch = () => {
    console.log(advocates);
    setFilteredAdvocates(advocates);
  };

  return (
    <main style={{ margin: "24px" }}>
      <h1 className="font-semibold text-2xl">Solace Advocates</h1>
      <br />
      <br />
      <form>
        <p className="text-lg py-1">Search</p>
        <p className="py-1">
          Searching for:{" "}
          <span id="search-term" className="ml-1 font-medium">
            {searchTerm}
          </span>
        </p>
        <input
          placeholder="Search...."
          className="px-2 py-1 rounded"
          style={{ border: "1px solid black" }}
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
        <button
          onClick={resetSearch}
          type="reset"
          className="ml-2 px-2 py-1.5 rounded bg-amber-600 text-white hover:bg-amber-700 transition-colors"
        >
          Reset Search
        </button>
      </form>
      <br />
      <br />
      <table className="divide-y divide-slate-700">
        <thead>
          <tr className=" text-nowrap">
            <th className="text-start pr-4 font-semibold">First Name</th>
            <th className="text-start pr-4 font-semibold">Last Name</th>
            <th className="text-start pr-4 font-semibold">City</th>
            <th className="text-start pr-4 font-semibold">Degree</th>
            <th className="text-start pr-4 font-semibold">Specialties</th>
            <th className="text-start pr-4 font-semibold">
              Years of Experience
            </th>
            <th className="text-start pr-4 font-semibold">Phone Number</th>
          </tr>
        </thead>
        {!isLoading && (
          <tbody className="divide-y divide-slate-700">
            {filteredAdvocates.map((advocate) => {
              return (
                <tr key={advocate.id}>
                  <td className="pr-2 py-2 text-gray-800 font-medium align-text-top whitespace-nowrap">
                    {advocate.firstName}
                  </td>
                  <td className="pr-2 py-2 text-gray-800 font-medium align-text-top whitespace-nowrap">
                    {advocate.lastName}
                  </td>
                  <td className="pr-2 py-2 text-gray-500 align-text-top whitespace-nowrap">
                    {advocate.city}
                  </td>
                  <td className="pr-2 py-2 text-gray-500 align-text-top">
                    {advocate.degree}
                  </td>
                  <td className="pr-2 py-2 text-gray-500 text-sm">
                    {advocate.specialties.map((s) => (
                      <div key={`${advocate.id}-${s}`}>{s}</div>
                    ))}
                  </td>
                  <td className="pr-2 py-2 text-gray-500 align-text-top">
                    {advocate.yearsOfExperience}
                  </td>
                  <td className="pr-2 py-2 text-gray-500 align-text-top">
                    {formatPhoneNumber(advocate.phoneNumber)}
                  </td>
                </tr>
              );
            })}
          </tbody>
        )}
      </table>
      {isLoading && <div>Loading...</div>}
    </main>
  );
}
