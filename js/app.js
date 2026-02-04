function calculateGradient(rangeElement, textElement, rate) {
    const currentVal = textElement.value = rangeElement.value;
    const maxValue = rangeElement.getAttribute('max');
    const percent = (currentVal * 100) / maxValue;
    rangeElement.style.background = 'linear-gradient(90deg, #1091cc ' + percent + '%, #d8d8d8 ' + percent + '%)';
    if (rate) {
        return textElement.value = currentVal / rate;
    }
}

function preventTypeNonNumbers(event) {
    if (event.which < 48 || event.which > 57) {
        event.preventDefault();
    }
}

function initializer() {
  const rangeInput = document.getElementById('range');
  const rangeTextInput = document.getElementById('range-text');
  const rateInput = document.getElementById('rate');
  const rateTextInput = document.getElementById('rate-text');
  const textInputs = document.querySelectorAll('input[type=text]');
  const form = document.getElementById('mc-form');

  calculateGradient(rangeInput, rangeTextInput);
  calculateGradient(rateInput, rateTextInput, 10);

  rangeInput.addEventListener('input', function (event) {
      calculateGradient(event.target, rangeTextInput, null)
  }, false);

  rateInput.addEventListener('input', function (event) {
      calculateGradient(event.target, rateTextInput, 10)
  });

  textInputs.forEach(function (input) {
    input.addEventListener('keypress', preventTypeNonNumbers);
    input.addEventListener('paste', function (e) {
      e.preventDefault()
    });
  });

  form.addEventListener('submit', validateForm)
}

function calculateMorgage(form) {
  const yearsOfMortgage = form.elements['range-text'].value;
  const interestRate = form.elements['rate-text'].value;
  const loanAmount = form.elements['loan'].value;
  const annualTax = form.elements['tax'].value;
  const annualInsurance = form.elements['insurance'].value;

  const principleAndInterests = ((interestRate / 100) / 12) * loanAmount / (1 - Math.pow((1 + ((interestRate / 100) / 12)), -yearsOfMortgage * 12));
  const tax = annualTax / 12;
  const insurance = annualInsurance / 12;
  const monthlyPayment = principleAndInterests + tax + insurance;

  const principleElement = document.getElementById('principle-and-interests');
  principleElement.innerText = principleAndInterests.toFixed(2);
  principleElement.parentElement.classList.add('result');

  const taxResult = document.getElementById('tax-result');
  taxResult.innerText = tax.toFixed(2);
  taxResult.parentElement.classList.add('result');

  const insuranceResult = document.getElementById('insurance-result');
  insuranceResult.innerText = insurance.toFixed(2);
  insuranceResult.parentElement.classList.add('result');

  const monthyPaymentResult = document.getElementById('monthly-payment');
  monthyPaymentResult.innerText = monthlyPayment.toFixed(2);
  monthyPaymentResult.parentElement.classList.add('result');

  form.querySelectorAll('button')[0].innerText = 'Recalculate';
}

function validateForm(event) {
    event.preventDefault();
    const form = this;
    const inputs = Array.from(form.querySelectorAll('input'));

    inputs.some(function (element) {
      element.classList.remove('has-error');
      if (element.nextElementSibling != null && element.nextElementSibling.classList.contains('helper')) {
        element.nextElementSibling.style.display = 'none';
      }

      if (element.getAttribute('required') !== null) {
        if (isNaN(parseFloat(element.value)) || element.value.trim().length === 0) {
          element.classList.add('has-error');
          if (element.nextElementSibling != null && element.nextElementSibling.classList.contains('helper')) {
            element.nextElementSibling.style.display = 'block';
          }

          return true;
        }
      }

      return false;
    });

    calculateMorgage(this);
}

document.addEventListener('DOMContentLoaded', initializer);
