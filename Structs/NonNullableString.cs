using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace GovCheck.Structs
{
    public struct NonNullableString
    {
        public string Value { get; set; }
        public NonNullableString(string value)
        {
            Value = value ?? "";
        }

        public static explicit operator string(NonNullableString value)
        {
            return value.ToString();
        }

        public static explicit operator NonNullableString(string value)
        {
            return new NonNullableString(value);
        }

        public override string ToString()
        {
            return Value;
        }

        public static bool operator ==(NonNullableString leftString, NonNullableString rightString)
        {
            return leftString.Equals(rightString);
        }

        public static bool operator !=(NonNullableString leftString, NonNullableString rightString)
        {
            return !(leftString == rightString);
        }

        public static bool operator ==(string leftString, NonNullableString rightString)
        {
            return leftString.Equals(rightString.Value);
        }

        public static bool operator !=(string leftString, NonNullableString rightString)
        {
            return !(leftString == rightString);
        }

        public override bool Equals(object obj)
        {
            if (obj == null) { return false; }
            return this.Value == ((NonNullableString)obj).Value;
        }

        public override int GetHashCode()
        {
            return this.Value.GetHashCode();
        }
    }
}
