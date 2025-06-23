// تعريف المتغيرات
let links = []; // الروابط مؤقتة
let accounts = JSON.parse(localStorage.getItem('fbAccounts')) || []; // الحسابات محفوظة

function addLink() {
  const linkInput = document.getElementById('linkInput').value;
  if (linkInput && linkInput.includes('facebook.com')) {
    links.push(linkInput);
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
    localStorage.setItem('fbAccounts', JSON.stringify(accounts)); // حفظ الحسابات
    document.getElementById('accountInput').value = '';
    alert('تم إضافة الحساب بنجاح!');
  } else {
    alert('أدخل بيانات الحساب بالصيغة: إيميل:كلمة سر');
  }
}

function displayLinks() {
  const linkList = document.getElementById('linkList');
  linkList.innerHTML = '';
  if (links.length > 0) {
    links.forEach((link, index) => {
      const li = document.createElement('li');
      li.textContent = link;
      const deleteBtn = document.createElement('button');
      deleteBtn.textContent = 'حذف';
      deleteBtn.onclick = () => {
        links.splice(index, 1);
        displayLinks();
      };
      li.appendChild(deleteBtn);
      linkList.appendChild(li);
    });
  } else {
    linkList.innerHTML = '<li>لا يوجد روابط مضافة</li>';
  }
}

function toggleAccounts() {
  const accountList = document.getElementById('accountList');
  if (accountList.style.display === 'none' || accountList.style.display === '') {
    accountList.style.display = 'block';
    accountList.innerHTML = '';
    if (accounts.length > 0) {
      accounts.forEach((account, index) => {
        const li = document.createElement('li');
        li.textContent = account.email;
        const deleteBtn = document.createElement('button');
        deleteBtn.textContent = 'حذف';
        deleteBtn.onclick = () => {
          accounts.splice(index, 1);
          localStorage.setItem('fbAccounts', JSON.stringify(accounts)); // تحديث الحسابات
          toggleAccounts();
        };
        li.appendChild(deleteBtn);
        accountList.appendChild(li);
      });
    } else {
      accountList.innerHTML = '<li>لا يوجد حسابات مضافة</li>';
    }
  } else {
    accountList.style.display = 'none';
  }
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
        alert(تم ${action === 'postLike' ? 'لايك المنشور' : action === 'commentLike' ? 'لايك التعليق' : 'متابعة الصفحة'} بنجاح!);
      } else {
        alert('حدث خطأ أثناء التنفيذ!');
      }
    } catch (error) {
      console.error('Error:', error);
      alert('فشل التنفيذ، تحقق من الاتصال أو بيانات الحساب!');
    }
  }
  // مسح الروابط بس بعد التنفيذ، الحسابات تبقى محفوظة
  links = [];
  displayLinks();
}

document.getElementById('linkInput').addEventListener('keypress', function(e) {
  if (e.key === 'Enter') addLink();
});

document.getElementById('accountInput').addEventListener('keypress', function(e) {
  if (e.key === 'Enter') addAccount();
});
