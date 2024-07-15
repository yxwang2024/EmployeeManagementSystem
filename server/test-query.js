module.exports =

mutation {
    updateProfileName(input: {id: "66936aa0785792d5c5ad76a7", firstName: "John", middleName: "a", lastName: "Doe"}) {
      name {
        firstName
        lastName
      }
    }
    updateProfileIdentity(input: {id: "66936aa0785792d5c5ad76a7", ssn: "123-45-6789", dob: "1990-01-01", gender: "female"}) {
      identity {
        ssn
        dob
        gender
      }
    }
    updateProfileCurrentAddress(input: {id: "66936aa0785792d5c5ad76a7", street: "123 4th Ave", building: "APT110", city: "Seattle",state:"WA",zip:"98100"}) {
      currentAddress {
        street
        building
        city
        state
        zip
      }
    }
    updateProfileContactInfo(input: {id: "66936aa0785792d5c5ad76a7",cellPhone:"1002003456"}) {
      contactInfo{
        cellPhone
      }
    }
    updateProfileEmployment(input: {id: "66936aa0785792d5c5ad76a7",visaTitle:"OPT",startDate:"2024-01-01",endDate:"2025-01-01"}) {
      employment{
        visaTitle,
        startDate,
        endDate
      }
    }
    
  }
  