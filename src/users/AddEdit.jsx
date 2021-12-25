import React, { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as Yup from 'yup';

import { userService, alertService } from '../_services';

function AddEdit({ history, match }) {
  const { id } = match.params;
  const isAddMode = !id;

  // form validation rules
  const validationSchema = Yup.object().shape({
    firstname: Yup.string().required('First Name is required'),
    midname: Yup.string().required('First Name is required'),
    lastname: Yup.string().required('Last Name is required'), 
    sex: Yup.string().required('Sex is required'),
    job: Yup.string().required('Job is required'),
    village: Yup.string().required('Village is required'),
    religion: Yup.string().required('Religion is required'),
    age: Yup.string().required('Age is required'),
    degree: Yup.string().required('Degree is required'),
    identification: Yup.string()
      .required('Identification is required')
      .matches(/^[0-9]+$/, "Must be only digits")
      .test(
        'len',
        'Identification must be 9 or 12 characters',
        (val) => val.length === 9 || val.length === 12
      ),
  });

  // functions to build form returned by useForm() hook
  const { register, handleSubmit, reset, setValue, errors, formState } =
    useForm({
      resolver: yupResolver(validationSchema),
    });

  function onSubmit(data) {
    console.log(data);
    return isAddMode ? createUser(data) : updateUser(id, data);
  }

  function createUser(data) {
    return userService
      .create(data)
      .then(() => {
        alertService.success('User added', { keepAfterRouteChange: true });
        history.push('.');
      })
      .catch(alertService.error);
  }

  function updateUser(id, data) {
    return userService
      .update(id, data)
      .then(() => {
        alertService.success('User updated', { keepAfterRouteChange: true });
        history.push('..');
      })
      .catch(alertService.error);
  }

  useEffect(() => {
    if (!isAddMode) {
      // get user and set form fields
      userService.getById(id).then((user) => {
        const fields = ['firstname','midname', 'lastname', 'sex', 'identification', 'age'];
        fields.forEach((field) => setValue(field, user[field]));
      });
    }
  }, []);

  return (
    <form onSubmit={handleSubmit(onSubmit)} onReset={reset}>
      <h1>{isAddMode ? 'Add User' : 'Edit User'}</h1>
      <div className="form-row">
        <div className="form-group col-3">
          <label>First Name</label>
          <input
            name="firstname"
            type="text"
            ref={register}
            className={`form-control ${errors.firstname ? 'is-invalid' : ''}`}
          />
          <div className="invalid-feedback">{errors.firstname?.message}</div>
        </div>
        <div className="form-group col-4">
          <label>Mid Name</label>
          <input
            name="midname"
            type="text"
            ref={register}
            className={`form-control ${errors.midname ? 'is-invalid' : ''}`}
          />
          <div className="invalid-feedback">{errors.midname?.message}</div>
        </div>
        <div className="form-group col-3">
          <label>Last Name</label>
          <input
            name="lastname"
            type="text"
            ref={register}
            className={`form-control ${errors.lastname ? 'is-invalid' : ''}`}
          />
          <div className="invalid-feedback">{errors.lastname?.message}</div>
        </div>
      </div>

      <div className="form-row">
        <div className="form-group col">
          <label>Sex</label>
          <select
            name="sex"
            ref={register}
            className={`form-control ${errors.sex ? 'is-invalid' : ''}`}
          >
            <option value=""></option>
            <option value="Nam">Nam</option>
            <option value="Nu">Nữ</option>
          </select>
          <div className="invalid-feedback">{errors.sex?.message}</div>
        </div>
        <div className="form-group col">
          <label>Age</label>
          <input
            name="age"
            type="text"
            ref={register}
            className={`form-control ${errors.age ? 'is-invalid' : ''}`}
          />
          <div className="invalid-feedback">{errors.age?.message}</div>
        </div>
        <div className="form-group col-5">
          <label>Religion</label>
          <select
            name="religion"
            ref={register}
            className={`form-control ${errors.religion ? 'is-invalid' : ''}`}
          >
            <option value=""></option>
            <option value="Không">Không</option>
            <option value="Phật giáo">Phật giáo</option>
            <option value="Thiên chúa giáo">Thiên chúa giáo</option>
            <option value="Hồi giáo">Hồi giáo</option>
            <option value="Ấn độ giáo">Ấn độ giáo</option>
            <option value="Cao đài giáo">Cao đài giáo</option>
            <option value="Khác">Khác</option>
          </select>
          <div className="invalid-feedback">{errors.religion?.message}</div>
        </div>
      </div>
      {!isAddMode && (
        <div>
          <h3 className="pt-3">Change Password</h3>
          <p>Leave blank to keep the same password</p>
        </div>
      )}
      <div className="form-row">
        <div className="form-group col">
          <label>Identification</label>
          <input
            name="identification"
            type="identification"
            ref={register}
            className={`form-control ${
              errors.identification ? 'is-invalid' : ''
            }`}
          />
          <div className="invalid-feedback">
            {errors.identification?.message}
          </div>
        </div>
        <div className="form-group col-4">
          <label>Village</label>
          <select
            name="village"
            ref={register}
            className={`form-control ${errors.village ? 'is-invalid' : ''}`}
          >
            <option value=""></option>
            <option value="1">1</option>
            <option value="2">2</option>
          </select>
          <div className="invalid-feedback">{errors.village?.message}</div>
        </div>
      </div>
      <div className="form-row">
        <div className="form-group col">
          <label>Degree</label>
          <input
            name="degree"
            type="text"
            ref={register}
            className={`form-control ${errors.degree ? 'is-invalid' : ''}`}
          />
          <div className="invalid-feedback">{errors.degree?.message}</div>
        </div>
        <div className="form-group col">
          <label>Job</label>
          <input
            name="job"
            type="text"
            ref={register}
            className={`form-control ${errors.job ? 'is-invalid' : ''}`}
          />
          <div className="invalid-feedback">{errors.job?.message}</div>
        </div>
        <div className="form-group col">
          <label>Date-Of-Birth</label>
          <input
            name="date_of_birth"
            type="date"
            ref={register}
            className={`form-control ${errors.job ? 'is-invalid' : ''}`}
          />
          <div className="invalid-feedback">{errors.job?.message}</div>
        </div>
      </div>
      <div className="form-group">
        <button
          type="submit"
          disabled={formState.isSubmitting}
          className="btn btn-primary"
        >
          {formState.isSubmitting && (
            <span className="spinner-border spinner-border-sm mr-1"></span>
          )}
          Save
        </button>
        <Link to={isAddMode ? '.' : '..'} className="btn btn-link">
          Cancel
        </Link>
      </div>
    </form>
  );
}

export { AddEdit };