import { useState, useEffect } from "react";
import PersonnelDataService from "../../services/personnel";
// import { Link } from "react-router-dom";

const EditOfficer = (props) => {
  const [edit, setEdit] = useState(false);
  // const [officerId, setOfficerId] = useState(props.match.params.id);

  const [officerInfo, setOfficerInfo] = useState({
    _id: "",
    surname: "",
    first: "",
    middle: "",
    postNom: "",
    birthDate: "",
    birthStardate: "",
    birthPlace: "",
    birthNote: "",
    deathDate: "",
    deathStardate: "",
    deathPlace: "",
    deathNote: "",
    serial: "",
    events: [],
  });

  let [btnLabel, setBtnLabel] = useState("Create");

  const onChangeOfficerInfo = (e) => {
    setOfficerInfo({ ...officerInfo, [e.target.name]: e.target.value });
  };

  useEffect(() => {
    let db = props.database;
    let officerId = props.match.params.id;
    const getPersonnel = async (id) => {
      try {
        let response = await PersonnelDataService.get(id, db);
        setOfficerInfo(response.data);
        // console.log(response.data);
      } catch (err) {
        console.error(err);
      }
    };
    getPersonnel(officerId);
    setEdit(true);
    setBtnLabel("Update");
  }, [edit, props.database, props.match.params.id]);

  const saveOfficerInfo = (e) => {
    e.preventDefault();

    let data = officerInfo;

    if (edit) {
      data._id = props.match.params.id;
      PersonnelDataService.updateOfficer(data)
        .then((response) => {
          // setSubmitted(true);
          console.log(response.data);
        })
        .catch((e) => {
          console.error(e);
        });
    } else {
      PersonnelDataService.createOfficer(data)
        .then((response) => {
          // setSubmitted(true);
          console.log(response.data);
        })
        .catch((e) => {
          console.error(e);
        });
    }
  };

  return (
    <>
      <form className="d-flex row my-1 mx-2 form-group" onSubmit={saveOfficerInfo}>
        <h3 className="col text-center">{btnLabel} Officer Profile</h3>
        <div class="w-100"></div>
        <div className="col"></div>
        <input
          className="col form-control form-control-lg my-1"
          type="text"
          name="serial"
          placeholder="Starfleet Serial Number"
          value={officerInfo.serial}
          onChange={(e) => onChangeOfficerInfo(e)}
        />
        <div className="col"></div>
        <div class="w-100"></div>{" "}
        <input
          className="col form-control form-control-lg my-1"
          type="text"
          autoFocus
          name="surname"
          placeholder="Surname"
          value={officerInfo.surname}
          onChange={(e) => onChangeOfficerInfo(e)}
        />
        <input
          className="col form-control form-control-lg my-1"
          type="text"
          name="first"
          placeholder="First Name"
          value={officerInfo.first}
          onChange={(e) => onChangeOfficerInfo(e)}
        />
        <input
          className="col form-control form-control-lg my-1"
          type="text"
          name="middle"
          placeholder="Middle Name"
          value={officerInfo.middle}
          onChange={(e) => onChangeOfficerInfo(e)}
        />
        <input
          className="col form-control form-control-lg my-1"
          type="text"
          name="postNom"
          placeholder="Post Nominals"
          value={officerInfo.postNom}
          onChange={(e) => onChangeOfficerInfo(e)}
        />
        <div class="w-100"></div>{" "}
        <label className="col-auto my-1 text-right form-control-lg" htmlFor="birthDate">
          Date Of Birth:
        </label>
        <input
          className="col form-control form-control-sm my-1"
          type="date"
          name="birthDate"
          value={officerInfo.birthDate ? officerInfo.birthDate.slice(0, 10) : ""}
          onChange={(e) => onChangeOfficerInfo(e)}
        />
        <select
          className="col form-control my-1"
          name="birthNote"
          value={officerInfo.birthNote}
          onChange={(e) => onChangeOfficerInfo(e)}
        >
          <option>Exact Date</option>
          <option value="approx">Approximate Date</option>
          <option value="before">Before This Date</option>
          <option value="after">After This Date</option>
        </select>
        <label className="col-auto my-1 form-control-lg" htmlFor="deathDate">
          Date Of Death:
        </label>
        <input
          className="col form-control form-control-sm my-1"
          type="date"
          name="deathDate"
          value={officerInfo.deathDate ? officerInfo.deathDate.slice(0, 10) : ""}
          onChange={(e) => onChangeOfficerInfo(e)}
        />
        <select
          className="col form-control my-1"
          name="deathNote"
          value={officerInfo.deathNote}
          onChange={(e) => onChangeOfficerInfo(e)}
        >
          <option>Exact Date</option>
          <option value="approx">Approximate Date</option>
          <option value="before">Before This Date</option>
          <option value="after">After This Date</option>
        </select>
        <div class="w-100"></div>{" "}
        <label className="col-auto my-1 text-right form-control-lg" htmlFor="birthPlace">
          Place Of Birth:
        </label>
        <input
          className="col form-control form-control-lg my-1"
          type="text"
          name="birthPlace"
          placeholder="Place Of Birth"
          value={officerInfo.birthPlace}
          onChange={(e) => onChangeOfficerInfo(e)}
        />
        {/* <div className="col"></div> */}
        <label className="col-auto my-1 form-control-lg" htmlFor="deathPlace">
          Place Of Death:
        </label>
        <input
          className="col form-control form-control-lg my-1"
          type="text"
          name="deathPlace"
          placeholder="Place Of Death"
          value={officerInfo.deathPlace}
          onChange={(e) => onChangeOfficerInfo(e)}
        />
        <div class="w-100"></div>{" "}
        <div className="text-center">
          <button className="lcars_btn beige_btn all_round">{btnLabel} Officer</button>
        </div>
      </form>
    </>
  );
};

export default EditOfficer;
