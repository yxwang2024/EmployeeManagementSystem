const gql = require('graphql-tag')

const typeDefs = gql`
    extend type Query {
        profiles: [Profile]
        profile(id: ID!): Profile
        profileByEmployeeId(employeeId: ID!): Profile
        profileByEmail(email: String!): Profile
    }

    extend type Mutation {
        updateProfileName(input:NameInput):Profile
        updateProfileIdentity(input: IdentityInput):Profile
        updateProfileCurrentAddress(input: AddressInput):Profile
        updateProfileContactInfo(input: ContactInfoInput):Profile
        updateProfileEmployment(input: EmploymentInput):Profile
    }

    type Name {
        firstName: String!
        middleName: String
        lastName: String!
        preferredName: String
    }

    type Identity {
        ssn: String!
        dob: String!
        gender: String!
    }

    type Address {
        street: String!
        building: String
        city: String!
        state: String!
        zip: String!
    }

    type ContactInfo {
        cellPhone: String!
        workPhone: String
    }

    type Employment {
        visaTitle: String!
        startDate: String!
        endDate: String!
    }

    type Profile {
        id: ID!
        employee:Employee!
        email:String!
        name:Name
        profilePicture:String
        identity:Identity
        currentAddress:Address
        contactInfo:ContactInfo
        employment:Employment
    }

    input NameInput {
        id: ID!
        firstName: String!
        middleName: String
        lastName: String!
        preferredName: String
    }

    input IdentityInput {
        id: ID!
        ssn: String!
        dob: String!
        gender: String!
    }

    input AddressInput {
        id: ID!
        street: String!
        building: String
        city: String!
        state: String!
        zip: String!
    }

    input ContactInfoInput {
        id: ID!
        cellPhone: String!
        workPhone: String
    }

    input EmploymentInput {
        id: ID!
        visaTitle: String!
        startDate: String!
        endDate: String!
    }
    
`

module.exports = typeDefs



