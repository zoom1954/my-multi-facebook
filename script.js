let links = JSON.parse(localStorage.getItem('fbLinks')) || [];
let accounts = JSON.parse(localStorage.getItem('fbAccounts')) || [];

function addLink() {
  const linkInput = document.getElementById('linkInput').value;
  if (linkInput && linkInput.includes('facebook.com')) {
    links.push(linkInput);
    localStorage.setItem('fbLinks', JSON.stringify(links));
    displayLinks();
    document.getElementById('linkInput').value = '';
  } else {
    alert('أدخل رابط فيسبوك صحيح!');
  }
}

function addAccount() {
  const accountInput = document.getElementById('accountInput').value;
  const [email, pass] = accountInput.split(':');
  if (email && pass) {
    accounts.push({ email, pass });
    localStorage.setItem('fbAccounts', JSON.stringify(accounts));
    displayAccounts();
    document.getElementById('accountInput').value = '';
  } else {
    alert('أدخل بيانات الحساب بالصيغة: إيميل:كلمة سر');
  }
}

function displayLinks() {
  const linkList = document.getElementById('linkList');
  linkList.innerHTML = '';
  links.forEach((link, index) => {
    const li = document.createElement('li');
    li.textContent = link;
    const deleteBtn = document.createElement('button');
    deleteBtn.textContent = 'حذف';
    deleteBtn.onclick = () => {
      links.splice(index, 1);
      localStorage.setItem('fbLinks', JSON.stringify(links));
      displayLinks();
    };
    li.appendChild(deleteBtn);
    linkList.appendChild(li);
  });
}

function displayAccounts() {
  const accountList = document.getElementById('accountList');
  accountList.innerHTML = '';
  accounts.forEach((account, index) => {
    const li = document.createElement('li');
    li.textContent = account.email;
    const deleteBtn = document.createElement('button');
    deleteBtn.textContent = 'حذف';
    deleteBtn.onclick = () => {
      accounts.splice(index, 1);
      localStorage.setItem('fbAccounts', JSON.stringify(accounts));
      displayAccounts();
    };
    li.appendChild(deleteBtn);
    accountList.appendChild(li);
  });
}

async function performAction(action) {
  if (links.length === 0 || accounts.length === 0) {
    alert('أضف رابطًا وحسابًا أولاً!');
    return;
  }
  for (const link of links) {
    try {
      const response = await fetch('https://azizass254.fb-automation.repl.co/perform-action', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ accounts, url: link, action }),
      });
      const result = await response.json();
      console.log(result);
      if (result.status === 'Done') {
        alert('تم تنفيذ الإجراء بنجاح!');
      } else {
        alert('حدث خطأ أثناء التنفيذ!');
      }
    } catch (error) {
      console.error('Error:', error);
      alert('فشل التنفيذ، تحقق من الاتصال أو بيانات الحساب!');
    }
  }
}

displayLinks();
displayAccounts();
