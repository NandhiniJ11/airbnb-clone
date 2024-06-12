import React from "react";
import "../styles/SearchDataPage.css";
import { useParams } from "react-router-dom";
import { Link } from "react-router-dom";
import { placesStore } from "../store/Store";
import { useState, useEffect } from "react";
import filterbtn from "../styles/filterBtn.png";
import { MdOutlinePets } from "react-icons/md";
import { AiFillStar } from "react-icons/ai";
import { TiTick } from "react-icons/ti";
import SearchPageFooter from "./SearchPageFooter";

const SearchDetails = (props) => {
  const [openFilter, setOpenFilter] = useState(false); // toggle the filter dropdowm
  const [openCoupleFilter, setOpenCoupleFilter] = useState(false); // toggle the allowCouple button
  const [openPetFilter, setOpenPetFilter] = useState(false); // toggle the allowPet button

  const [allowPets, setAllowPets] = useState(null); // topggle the pets dropdown
  const [allowCouple, setAllowCouple] = useState(null);
  const [amenityFilter, setAmenityFilter] = useState("");

  const [showResetFilter, setShowResetFilter] = useState(false);
  const [priceFilterMin, setPriceFilterMin] = useState(Number.NEGATIVE_INFINITY);
  const [priceFilterMax, setPriceFilterMax] = useState(Number.POSITIVE_INFINITY);

  const params = useParams();
  const { loc } = params;

  var placeDetailsArray = placesStore.filter((item) =>
    item.location.toLocaleLowerCase().includes(loc.toLocaleLowerCase())
  ); // getting the details from the main array with filter and storing it in "placeDetailsArray" and then passing it on to "orignalArray" state

  const [orignalArray, setOriginalArray] = useState(placeDetailsArray);

  const reviewesArr = [
    "Light cosy room in a modern home. Cosy clean light room with single bed and Wi-Fi, Furniture in this room will be update to higher standards by the time of your stay.",
    "Bright airy Studio apartment located on the Ground floor, a beautiful self-contained garden studio, located in the heart of historic Highgate Village.",
    "The apartment is equipped with a double bed and a double sofa bed and can comfortably accommodate 2 adults.",
    "The room has been newly decorated, Plenty of space for luggage, desk space for work. moreover the staff was very coopervative and helped us throughout the stay",
    "Light cosy room in a modern home. Cosy clean light room with single bed and Wi-Fi, Furniture in this room will be update to higher standards by the time of your stay.",
    "Bright airy Studio apartment located on the Ground floor, a beautiful self-contained garden studio, located in the heart of historic Highgate Village.",
    "The apartment is equipped with a double bed and a double sofa bed and can comfortably accommodate 2 adults.",
    "The room has been newly decorated, Plenty of space for luggage, desk space for work. moreover the staff was very coopervative and helped us throughout the stay",
    "Bright airy Studio apartment located on the Ground floor, a beautiful self-contained garden studio, located in the heart of historic Highgate Village.",
    "Bright airy Studio apartment located on the Ground floor, a beautiful self-contained garden studio, located in the heart of historic Highgate Village.",
  ];

  useEffect(() => {
    if (allowPets === null && allowCouple === null && !amenityFilter && !priceFilterMin && !priceFilterMax) {
      return;
    }

    setShowResetFilter(true);

    const isCoupleFilterApplied = !(allowCouple === null);
    const isPetFilterApplied = !(allowPets === null);

    const filteredArray = placeDetailsArray.filter((item) => {
      const petFilterResult = !isPetFilterApplied || !!item.pets === allowPets;
      const coupleFilterResult =
        !isCoupleFilterApplied || !!item.couple === allowCouple;
      const amenityFilterResult =
        !amenityFilter || item.amenities?.includes(amenityFilter.toLowerCase());
        const priceRangeFilterResult= item.price >= priceFilterMin && item.price<= priceFilterMax

      return petFilterResult && coupleFilterResult && amenityFilterResult && priceRangeFilterResult;
    });

    setOriginalArray(filteredArray);
    closeAllFilterDropdowns();
  }, [allowPets, allowCouple, amenityFilter, priceFilterMax, priceFilterMin]);

  const resetFilters = () => {
    setOpenFilter(false);
    setOriginalArray(placeDetailsArray);
    setAllowPets(null);
    setAllowCouple(null);
    closeAllFilterDropdowns();
    setShowResetFilter(false);
    setAmenityFilter("");
    setPriceFilterMax(Number.POSITIVE_INFINITY);
    setPriceFilterMin(Number.NEGATIVE_INFINITY);
  };

  const closeAllFilterDropdowns = () => {
    setOpenCoupleFilter(false);
    setOpenPetFilter(false);
    setOpenFilter(false);
  };

  const lowToHighFilter = () => {
    setShowResetFilter(true);
    const eitherSort = (arr = []) => {
      const sorter = (a, b) => {
        return +a.price - +b.price;
      };
      arr.sort(sorter);
    };
    eitherSort(placeDetailsArray);
    setOriginalArray(placeDetailsArray);
  };

  return (
    <div className="searchDeatilsMainParent">
      <p className="text-2xl flex relative uppercase fof left-24 top-36">
        Total {orignalArray.length} Stays in {loc}{" "}
      </p>

      <div className="functionalityButtonsHold cursor-pointer flex gap-4">
        <img
          src={filterbtn}
          className="w-36 zoom"
          onClick={() => {
            setOpenPetFilter(false);
            setOpenCoupleFilter(false);
            setOpenFilter((expanded) => !expanded);
          }}
        />

        <div
          className="flex coupleHold mt-3 zoom"
          onClick={() => {
            setOpenFilter(false);
            setOpenPetFilter(false);
            setOpenCoupleFilter((expanded) => !expanded);
          }}
        >
          <img
            src="https://cdn.iconscout.com/icon/premium/png-256-thumb/allowCouple-3431093-2863604.png"
            className="w-12 pt-1 h-10 pl-2 inline-block"
          />
          <p className=" inline-block pl-5"> Couple Friendly </p>
        </div>

        <div
          className="petHold mt-3 zoom"
          onClick={() => {
            setOpenFilter(false);
            setOpenCoupleFilter(false);
            setOpenPetFilter((expanded) => !expanded);
          }}
          onBlur={() => setOpenPetFilter(false)}
        >
          <MdOutlinePets className=" inline-block text-2xl pr-2" />
          <p className="cursor-pointer inline-block"> Pet Friendly </p>
        </div>

        {(showResetFilter || allowCouple !== null || allowPets !== null) && (
          <div className="mt-3 zoom" onClick={resetFilters}>
            <p className="petHold cursor-pointer inline-block">
              {" "}
              Reset filters{" "}
            </p>
          </div>
        )}
      </div>

      {openFilter && (
        <>
          {" "}
          <div className="dropdownFilter rounded-2xl capitalize">
            <div
              onClick={lowToHighFilter}
              className=" pt-4 mb-8 cursor-pointer h-2 "
            >
              Price low to high
            </div>
            <div
              onClick={() => {
                setPriceFilterMin(Number.NEGATIVE_INFINITY);
                setPriceFilterMax(999);
              }}
              className=" pt-4 mb-8 cursor-pointer h-2 "
            >
              {"Price < 1000"}
            </div>
            <div
              onClick={() => {
                setPriceFilterMin(1000);
                setPriceFilterMax(3000);
              }}
              className=" pt-4 mb-8 cursor-pointer h-2 "
            >
              {"Price 1000-3000"}
            </div>
            <div
              onClick={() => {
                setPriceFilterMin(3001);
                setPriceFilterMax(Number.POSITIVE_INFINITY);
              }}
              className=" pt-4 mb-8 cursor-pointer h-2 "
            >
              {"Price > 3000"}
            </div>
            <div
              onClick={() => setAmenityFilter("Broadband")}
              className="pt-4 mb-8  cursor-pointer h-2"
            >
              Broadband
            </div>
            <div
              onClick={() => setAmenityFilter("Washing Machine")}
              className="pt-4 mb-8  cursor-pointer h-2"
            >
              Washing Machine
            </div>
          </div>
        </>
      )}

      {openPetFilter && (
        <div className="selectDropDown">
          <div
            onClick={() => setAllowPets(true)}
            className=" pt-4 mb-8 cursor-pointer h-2 "
          >
            {" "}
            Yes{" "}
          </div>
          <div
            onClick={() => setAllowPets(false)}
            className="cursor-pointer h-2"
          >
            No{" "}
          </div>
        </div>
      )}

      <div className="zindex">
        {openCoupleFilter && (
          <div className="selectDropDownCouple cursor-pointer">
            <div
              onClick={() => setAllowCouple(true)}
              className=" pt-4 mb-8 cursor-pointer h-2"
            >
              {" "}
              Yes{" "}
            </div>
            <div
              onClick={() => setAllowCouple(false)}
              className="cursor-pointer h-2"
            >
              No{" "}
            </div>
          </div>
        )}
      </div>

      <div className=" topSearchLine absolute bg-slate-100"></div>

      {orignalArray.length > 0 && (
        <div className="placeDetailsHold relative">
          {orignalArray.map((item) => {
            return (
              <div key={item.id}>
                <Link to={`/${item.id}`}>
                  <img
                    src={item.homeMainPic}
                    className="object-cover relative searchDetailsImage"
                  />
                  <div className=" bifurcatingLine relative bg-slate-100"></div>

                  <div className="searchDatarevHold flex flex-col gap-1 relative">
                    <p className="fof text-md h-1"> {item.name} </p>
                  </div>

                  <p className=" inline-block relative text-xl mt-1 fof revSearchData">
                    <AiFillStar className=" fill-red-400 pb-1 text-3xl inline-block" />{" "}
                    {item.stars} (
                    {Math.floor(Math.random() * (999 - 100 + 1) + 100)}){" "}
                  </p>
                  <p className="SDPprice"> ${item.price}/ night </p>
                  {item.pets && (
                    <p className=" inline-block petWlcHold">
                      {" "}
                      <img
                        src="https://static.vecteezy.com/system/resources/previews/005/484/042/original/dog-logo-illustration-free-vector.jpg"
                        className=" w-16 h-16 inline-block"
                      />{" "}
                      Pets Are welcome{" "}
                    </p>
                  )}
                  {item.couple && (
                    <p className="coupleFriendlyHold relative">
                      {" "}
                      <img
                        src="https://cdn.iconscout.com/icon/premium/png-256-thumb/allowCouple-3431093-2863604.png"
                        className="w-12 pt-1 h-10 pl-2 inline-block"
                      />{" "}
                      Couple Friendly options{" "}
                    </p>
                  )}
                </Link>
              </div>
            );
          })}
        </div>
      )}

      {/* {orignalArray.length > 0 && (
        <div className="placeDetailsHold flex flex-col relative">
          {orignalArray.map((item) => {
            return (
              <div key={item.id}>
                <Link to={`/${item.id}`}>
                  <img
                    src={item.homeMainPic}
                    className="object-cover relative searchDetailsImage"
                  />
                  <div className=" bifurcatingLine relative bg-slate-100"></div>

                  <div className="searchDatarevHold flex flex-col gap-1 relative">
                    <p className="fof text-md h-1"> {item.name} </p>
                  </div>

                  <p className=" inline-block relative text-xl mt-1 fof revSearchData">
                    <AiFillStar className=" fill-red-400 pb-1 text-3xl inline-block" />{" "}
                    {item.stars} (
                    {Math.floor(Math.random() * (999 - 100 + 1) + 100)}){" "}
                  </p>
                  <p className="SDPprice"> ${item.price}/ night </p>
                  {item.pets && (
                    <p className=" inline-block petWlcHold">
                      {" "}
                      <img
                        src="https://static.vecteezy.com/system/resources/previews/005/484/042/original/dog-logo-illustration-free-vector.jpg"
                        className=" w-16 h-16 inline-block"
                      />{" "}
                      Pets Are welcome{" "}
                    </p>
                  )}
                  {item.couple && (
                    <p className="coupleFriendlyHold relative">
                      {" "}
                      <img
                        src="https://cdn.iconscout.com/icon/premium/png-256-thumb/allowCouple-3431093-2863604.png"
                        className="w-12 pt-1 h-10 pl-2 inline-block"
                      />{" "}
                      Couple Friendly options{" "}
                    </p>
                  )}
                </Link>
              </div>
            );
          })}
        </div>
      )} */}

      <div className="searchRevHold flex flex-col relative">
        {reviewesArr.slice(0, orignalArray.length).map((item) => {
          return (
            <div key={Math.random()}>
              <p className=" text-gray-500"> "{item}" </p>
            </div>
          );
        })}
      </div>

      {orignalArray.length > 8 ? (
        <div className="spFooterHold relative">
          <SearchPageFooter />
        </div>
      ) : (
        ""
      )}
    </div>
  );
};

export default SearchDetails;