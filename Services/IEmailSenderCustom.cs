using System.Collections.Generic;
using System.Threading.Tasks;

namespace GovCheck.Services
{
	public interface IEmailSenderCustom
	{
		Task SendEmailToAllAsync(IEnumerable<string> emails, string subject, string message);
	}
}
