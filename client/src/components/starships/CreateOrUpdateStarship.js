import { useState, useEffect } from "react";
import PersonnelDataService from "../../services/personnel";
// import { Link } from "react-router-dom";

const COUOfficer = (props) => {
  const [edit, setEdit] = useState(false);
  const [officerId, setOfficerId] = useState(props.match.params.id);

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

  const onChangeText = (e) => {
    setOfficerInfo({ ...officerInfo, [e.target.name]: e.target.value });
  };

  useEffect(() => {
    const getPersonnel = async (id) => {
      try {
        let response = await PersonnelDataService.get(id, props.database);
        setOfficerInfo(response.data);
        console.log(response.data);
      } catch (err) {
        console.error(err);
      }
    };
    getPersonnel(props.match.params.id);
    setEdit(true);
    setBtnLabel("Update");
  }, [edit]);

  if (props.match.params.id) {
  }

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
          console.log(e);
        });
    } else {
      PersonnelDataService.createOfficer(data)
        .then((response) => {
          // setSubmitted(true);
          console.log(response.data);
        })
        .catch((e) => {
          console.log(e);
        });
    }
  };
  console.log(officerInfo);

  return (
    <>
      <form className="d-flex flex-column my-2 mx-2 form-group" onSubmit={saveOfficerInfo}>
        <div className="row">
          <h3 className="text-center">{btnLabel} Officer Profile</h3>
        </div>
        <div className="row"></div>
        <div className="row">
          <input
            className="col form-control form-control-lg my-2"
            type="text"
            autoFocus
            name="surname"
            placeholder="Surname"
            value={officerInfo.surname}
            onChange={(e) => onChangeText(e)}
          />
          <input
            className="col form-control form-control-lg my-2"
            type="text"
            name="first"
            placeholder="First Name"
            value={officerInfo.first}
            onChange={(e) => onChangeText(e)}
          />
          <input
            className="col form-control form-control-lg my-2"
            type="text"
            name="middle"
            placeholder="Middle Name"
            value={officerInfo.middle}
            onChange={(e) => onChangeText(e)}
          />
          <input
            className="col form-control form-control-lg my-2"
            type="text"
            name="postNom"
            placeholder="Post Nominals"
            value={officerInfo.postNom}
            onChange={(e) => onChangeText(e)}
          />
        </div>
        <div className="d-flex row">
          <label className="col my-2 text-right form-control-lg" htmlFor="birthDate">
            Starfleet Serial #:
          </label>
          <input
            className="col form-control form-control-lg my-2"
            type="text"
            name="serial"
            placeholder="Starfleet Serial Number"
            value={officerInfo.serial}
            onChange={(e) => onChangeText(e)}
          />
          <label className="col my-2 text-right form-control-lg" htmlFor="birthDate">
            Date Of Birth:
          </label>
          <input
            className="col form-control form-control-lg my-2"
            type="date"
            name="birthDate"
            value={officerInfo.birthDate ? officerInfo.birthDate.slice(0, 10) : ""}
            onChange={(e) => onChangeText(e)}
          />
          <label className="col my-2 form-control-lg" htmlFor="deathDate">
            Date Of Death:
          </label>
          <input
            className="col form-control form-control-lg my-2"
            type="date"
            name="deathDate"
            value={officerInfo.deathDate ? officerInfo.deathDate.slice(0, 10) : ""}
            onChange={(e) => onChangeText(e)}
          />

          {/*   <select
            className="col-4 form-control my-2"
            name="category_id"
            value={category_id}
            onChange={(e) => onChangeText(e)}
          >
            <option key="0">Category</option>
            {categoryList.length !== 0 &&
              categoryList.map((category) => (
                <option key={category.category_id} value={category.category_id}>
                  {category.name}
                </option>
              ))}
          </select>
          <select
            className="col-4 form-control my-2"
            name="supplier_id"
            value={supplier_id}
            onChange={(e) => onChangeText(e)}
          >
            <option>Supplier</option>

            {supplierList.length !== 0 &&
              supplierList.map((supplier) => (
                <option key={supplier.supplier_id} value={supplier.supplier_id}>
                  {supplier.name} ({supplier.nickname})
                </option>
              ))}
            <option value="0">Other</option>
          </select>
        </div>
        <div className="row d-flex">
          <input
            className="col-3 form-control my-2"
            type="number"
            name="sku"
            min="0"
            placeholder="SKU #"
            value={sku}
            onChange={(e) => onChangeNum(e)}
          />
          <input
            className="col-3 form-control my-2"
            type="number"
            step="0.01"
            min="0"
            name="price_net"
            placeholder="Price"
            value={price_net}
            onChange={(e) => onChangeNum(e)}
          />
          <input
            className="col-3 form-control my-2"
            type="number"
            step="0.01"
            min="0"
            name="weight_full"
            placeholder="Weight Full (oz)"
            value={weight_full}
            onChange={(e) => onChangeNum(e)}
          />
          <input
            className="col-3 form-control my-2"
            type="number"
            step="0.01"
            min="0"
            name="weight_empty"
            placeholder="Weight Empty (oz)"
            value={weight_empty}
            onChange={(e) => onChangeNum(e)}
          />
        </div>
        <div className="d-flex justify-content-around">
          <div>
            <input
              className="form-check-input"
              type="checkbox"
              name="current"
              defaultChecked={current}
              onChange={(e) => onCheck(e)}
            />
            <label className="form-check-label">Current</label>
          </div>
          <div>
            <input
              className="form-check-input"
              type="checkbox"
              name="taxable"
              defaultChecked={taxable}
              onChange={(e) => onCheck(e)}
            />
            <label className="form-check-label">Taxable</label>
          </div>
          <div onChange={(e) => onChangeNum(e)}>
            Deposit:&nbsp;
            <div className="custom-control custom-radio custom-control-inline">
              <input
                type="radio"
                className="custom-control-input"
                id="none"
                name="deposit"
                value="0"
              />
              <label className="custom-control-label" htmlFor="none">
                0&#162;
              </label>
            </div>
            <div className="custom-control custom-radio custom-control-inline">
              <input
                type="radio"
                className="custom-control-input"
                id="radio8Cent"
                name="deposit"
                value="0.08"
              />
              <label className="custom-control-label" htmlFor="radio8Cent">
                8&#162;
              </label>
            </div>
            <div className="custom-control custom-radio custom-control-inline">
              <input
                type="radio"
                className="custom-control-input"
                id="radio10Cent"
                name="deposit"
                value="0.10"
              />
              <label className="custom-control-label" htmlFor="radio10Cent">
                10&#162;
              </label>
            </div>
            <div className="custom-control custom-radio custom-control-inline">
              <input
                type="radio"
                className="custom-control-input"
                id="radio20Cent"
                name="deposit"
                value="0.20"
              />
              <label className="custom-control-label" htmlFor="radio20Cent">
                20&#162;
              </label>
            </div>
          </div> */}
        </div>
        <div className="text-center">
          <button className="lcars_btn beige_btn all_round">{btnLabel} Officer</button>
        </div>
      </form>
    </>
  );
};

export default COUOfficer;
