import { Controller } from "@hotwired/stimulus"

// Connects to data-controller="activity"
export default class extends Controller {
  static targets = ['heart', 'attended', 'stars', 'link', 'menu', 'ellipsis', 'options', 'fewer', 'save', 'modal']
  static values = {
    userid: Number
  }
  connect() {
    const observer = new IntersectionObserver(this.handleIntersection.bind(this), {
      root: null, // use the viewport as the root
      rootMargin: "0px", // no margin
      threshold: 0.5, // trigger when 50% of the element is in view
    });
    this.closed = true

    observer.observe(this.element);
  }

  handleIntersection(entries, observer) {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        // The element is now in view
        this.createEncounter();
        observer.unobserve(entry.target); // stop observing once triggered
      }
    });
  }

  createEncounter() {
    const activityID = parseInt(this.element.getAttribute('data-value'), 10)
    fetch('/encounters', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
        'X-CSRF-Token': document.querySelector('meta[name="csrf-token"]').content
      },
      body: JSON.stringify({
        user_id: this.useridValue,
        activity_id: activityID
      }),
    })
  }

  like() {
    const activityID = parseInt(this.element.getAttribute('data-value'), 10)
    fetch(`/activities/${activityID}/like`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
        'X-CSRF-Token': document.querySelector('meta[name="csrf-token"]').content
      }
    })
    this.heartTarget.classList.toggle("heart-regular")
    this.heartTarget.classList.toggle("heart-solid")
  }

  attended() {
    const activityID = parseInt(this.element.getAttribute('data-value'), 10)
    fetch(`/activities/${activityID}/attended`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
        'X-CSRF-Token': document.querySelector('meta[name="csrf-token"]').content
      }
    })
    this.starsTarget.classList.toggle("d-none");
    this.attendedTarget.classList.toggle("d-none");
    this.linkTarget.classList.add("expanded")
  }

  rate(event) {
    if (event.target.classList.contains("star")) {
      const rating = event.target.getAttribute("data-rating");
      const activityID = parseInt(this.element.getAttribute('data-value'), 10);

      fetch(`/activities/${activityID}/rating`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
          'X-CSRF-Token': document.querySelector('meta[name="csrf-token"]').content
        },
        body: JSON.stringify({
          rating: parseInt(rating, 10),
        }),
      });

      // Toggle the visibility of stars and the checkmark
      this.starsTarget.classList.toggle("d-none");
      // Update the checkmark text based on the selected rating
      for (let i = 1; i <= 5; i++) {
        this.attendedTarget.classList.remove(`star-${i}`);
      }
      this.attendedTarget.classList.add('star')
      this.attendedTarget.classList.add(`star-${rating}`);
      this.attendedTarget.classList.remove('checkmark')
      this.attendedTarget.classList.toggle("d-none");
      this.linkTarget.classList.remove("expanded")
      // this.attendedTarget.innerHTML = `<span><i class='star'></i></span> Rated ${rating}`;
    }
  }

  expand(event) {
    if (event.target.classList.contains("option")) {
      console.log("called");
      const datamodel = document.querySelector(".bd-example-modal-lg");
      datamodel.model(show);
      const selection = event.target.getAttribute("data-selection");
      const activityID = parseInt(this.element.getAttribute('data-value'), 10);

      fetch(`/activities/${activityID}/${selection}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
          'X-CSRF-Token': document.querySelector('meta[name="csrf-token"]').content
        }
      });

      if (selection === 'fewer') {
        this.#fewer()
      } else {
        this.#save()
      }
    }

    this.modalTarget.classList.add('show')
    setTimeout(() => {
      this.closed = false
    }, 300);
    document.addEventListener('click', (e) => {
      if (this.modalTarget == e.target || this.modalTarget.contains(e.target)) {
        // pressed on card so stay
      } else {
        // we gooooo
        if (!this.closed) {
          this.collapse()
        }
      }
    })
  }

  collapse() {
    this.closed = true
    this.modalTarget.classList.remove('show')
  }

  #fewer() {

  }

  #save() {
    this.saveTarget.classList.toggle("save")
    this.saveTarget.classList.toggle("saved")
  }
}
